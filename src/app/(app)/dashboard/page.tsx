// in this we could have used useState for switch,but this would lead to inconsistency
// since it is also a type of form and we have already used React hook forms in sigh-up page

'use client'

import { useCallback, useEffect, useState } from "react"
import { Message } from "@/model/User"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
// import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import axios, { AxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Copy, Loader2, RefreshCcw } from "lucide-react"
import {MessageCard} from "@/components/MessageCard"
import { MoveLeft } from "lucide-react"
import Link from "next/link"
import Loader from "@/components/Loader"
import { ApiResponse } from "@/types/apiResponse"

const dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSwitching, setIsSwitching] = useState<boolean>(false) //using this because switch might take time
  const [loading, setLoading] = useState<boolean>(true)

  const {data: session} = useSession()
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const username = session?.user.username

  const {register, watch, setValue} = form
  // we have to tell watch which field we want to watch, in this case it is acceptMessages
  // so whereever we have acceptMessages in the form we will watch it
  const acceptMessages = watch("acceptMessages")

// here we can work without useCallback but it is good practice to use it because
// UseCallbck() allows us to isolate resource intensive functions so that they will not automatically run on every render.
// This hook only runs when one of its dependencies update improving performance.
// One reason to use useCallback is to prevent a component from re-rendering unless its props have changed.
  const fetchAcceptMessages = useCallback( async () => {
    if (!username) return;
    setIsSwitching(true)
    try {
      const respose = await axios.get(`/api/accept-message?username=${username}`)
      setValue("acceptMessages", respose.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message?? "Failed to fetch message setting")
    } finally {
      setIsSwitching(false)
    }
  }, [setValue, username])


  const fetchMessages = useCallback( async (refresh: boolean=false) => {
    setIsLoading(true)
    setIsSwitching(false)
    try {
      const response = await axios.get("/api/get-messages")
      // console.log("Musahid --> ",response)
      setMessages(response.data.data || [])
      if (refresh) {
        toast.success("Showing Latest Messages")
      }
    }catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message?? "No messages found")
    }finally {
      setIsLoading(false)
      setIsSwitching(false)
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchAcceptMessages();
      await fetchMessages()        
      setLoading(false);
    };
    if (username) {
      init();
    }
  }, [session, fetchMessages, fetchAcceptMessages, setValue]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-gray-900">
        <Loader />
      </div>
    );
  }

  const handleSwithchChange = async() => {
    try {
      const response = await axios.post("/api/accept-message", {acceptmessages: !acceptMessages})
      // see here we are watching it for change in switch
      setValue("acceptMessages", !acceptMessages)
      toast.success(response.data.message)
      }catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.error(axiosError.response?.data.message?? "Failed to update message settings")
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    // in below line we are making change in the UI without waiting for the response from the server
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  
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
    <div className="bg-gray-800 h-screen">
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-gray-800 text-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center border border-dashed rounded-2xl px-3 py-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard} className="cursor-pointer"><Copy /></Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwithchChange}
          disabled={isSwitching}
            className=" data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500 !ring-0 !border-none"
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4 text-gray-900"
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

      {/* Message Cards */}
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

        <Link href="/">
          <Button className="w-10 mt-10 bg-stone-100 text-gray-900 hover:bg-stone-100 cursor-pointer"><MoveLeft className="size-5"/></Button>
        </Link>
    </div>
    </div>
    </>
  )
}

export default dashboard