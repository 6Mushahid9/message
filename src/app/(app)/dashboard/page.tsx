'use client'

import { useCallback, useEffect, useState } from "react"
import { Message } from "@/model/User"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import {MessageCard} from "@/components/MessageCard"

const dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSwitching, setIsSwitching] = useState<boolean>(false)

  const {data: session} = useSession()
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {register, watch, setValue} = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessages = useCallback( async () => {
    setIsSwitching(true)
    try {
      const respose = await axios.get("/api/accept-message")
      setValue("acceptMessages", respose.data.isAcceptingMessages)
    } catch (error) {
      return toast.error("Failed to fetch message setting")
    } finally {
      setIsSwitching(false)
    }
  }, [setValue])

  const fetchMessages = useCallback( async (refresh: boolean=false) => {
    setIsLoading(true)
    setIsSwitching(false)
    try {
      const response = await axios.get("/api/get-messages")
      console.log("from frontend",response.data)
      setMessages(response.data.data || [])
      if (refresh) {
        toast.success("Showing Latest Messages")
      }
    }catch (error) {
      toast.error("Failed to fetch messages") 
    }finally {
      setIsLoading(true)
      setIsLoading(false)
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessages()
  }, [session, fetchMessages, fetchAcceptMessages, setValue])

  const handleSwithchChange = async() => {
    try {
      const response = await axios.post("/api/accept-messages", {acceptmessages: !acceptMessages})
        toast.success(response.data.message)
      }catch (error) {
      return toast.error("Failed to update message settings")
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    // in below line we are making change in the UI without waiting for the response from the server
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const username = session?.user
  // const baseUrl = `${window.location.protocol}//${window.location.host}`
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "";
  const profileUrl = `${baseUrl}/u/${username}`
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Copied to clipboard")
  }

  if(!session || !session.user){
    return <></>
  }
  return (
    <>
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwithchChange}
          disabled={isSwitching}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id?.toString() ?? index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
    </>
  )
}

export default dashboard