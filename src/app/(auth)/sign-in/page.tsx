'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Loader2} from "lucide-react"
import { Button } from "@/components/ui/button"

const signInPage =() => {
  const router = useRouter()

  // zod implementation
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }, 
  })

  // we are using form to get values from input fields, so we have to make a function to handle submit
  // here we are actually signing in the user using "next-auth"
  // you can skip this part ": z.infer<typeof signupSchema>" but this is industry standard
  const handleSubmit = async (data: z.infer<typeof signInSchema>) => {
    const response = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })
    if(response?.error) {
      toast.error(response.error)
      return 
    }
    router.replace('/dashboard')
  }

  return(
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join True Feedback
            </h1>
            <p className="mb-4">Welcome Back!</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="email" 
                    {...field}/>
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

              <Button type="submit" className='w-full'>
                Sign In
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <p>
              Not a member?{' '}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )

}
export default signInPage