'use client'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Loader2} from "lucide-react"
import { Button } from "@/components/ui/button"

const signUp =() => {
  const [username, setusername] = useState('')
  const [nameMessage, setnameMessage] = useState('')
  const [checkingName, setcheckingName] = useState(false)  // for loading during check
  const [isSubmitting, setIsSubmitting] = useState(false);

  // we have to check name availability but its not good to send request with every key stroke
  // so we use debounce
  const debounced = useDebounceCallback(setusername, 500)
  const router = useRouter()

  // zod implementation
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }, 
  })

  // now i have to check username availability using debounced value
  // useEffect will run on render 
  useEffect(() => {
    const handleCheckName = async () => {
     if(username){
      setcheckingName(true)
      setnameMessage('')
      try {
        const response = await axios.get(`/api/checkUnique?username=${username}`)
        console.log(response.data)
        setnameMessage(response.data.message)
      } catch (error) {
        // setnameMessage("Error checking username")
        // we could have used above method but we worked hard on backend route for different messages
        // to use messages from backend use ApiResponse we made
        const axiosError = error as AxiosError<ApiResponse>
        setnameMessage(axiosError.response?.data.message ?? "Error checking username")
      } finally {
        setcheckingName(false)  // after loading is done we set it to false to stop it
      } 
    }
    }
    // using below method our method will get called again when debounced value changes
    handleCheckName()
  }, [username])

  // this function will check for typos in mails during user creation
  const suggestCorrectGmail=(email: string): string | null =>{
    const typos: Record<string, string> = {
      "gamil.com": "gmail.com",
      "gnail.com": "gmail.com",
      "gmial.com": "gmail.com",
      "hotmial.com": "hotmail.com",
      "yaho.com": "yahoo.com",
      "outlok.com": "outlook.com",
      "icloud.co": "icloud.com",
    };
  
    const parts = email.toLowerCase().split("@");
    if (parts.length !== 2) return null;
  
    const domain = parts[1];
    const correction = typos[domain];
    if (correction) {
      return `${parts[0]}@${correction}`;
    }
    return null;
  }

  // we are using form to get values from input fields, so we have to make a function to handle submit
  // here we are actually signing up the user
  // you can skip this part ": z.infer<typeof signupSchema>" but this is industry standard
  const handleSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)

    // first check for gmail typos
    const suggestion = suggestCorrectGmail(data.email)
    if (suggestion) {
      toast(`Did you mean: ${suggestion}?`);
      setIsSubmitting(false)
      return
    }

    try {
      const response = await axios.post('/api/sign-up', data)
      toast.success(response.data.message)
      router.replace(`/verify/${username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message?? "Error signing up")
    } finally {
      setIsSubmitting(false)
    }
  }

  return(
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join True Feedback
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <Input placeholder="Enter your Name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                    {checkingName && <Loader2 className="animate-spin" />}
                    {!checkingName && nameMessage && (
                    <p
                      className={`text-sm ${
                        nameMessage === 'Username available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {nameMessage}
                    </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="email" 
                    {...field}/>
                    <p className='text-gray-400 text-sm'>We will send you a verification code</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" {...field} placeholder="password" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className='w-full' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <p>
              Already a member?{' '}
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )

}
export default signUp