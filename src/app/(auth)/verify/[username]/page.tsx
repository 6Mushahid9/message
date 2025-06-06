'use client'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import {z} from 'zod'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/apiResponse'
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


const verify = () => {
    const router = useRouter()
    const param = useParams<{username: string}>()
    const [isLoading, setIsLoading] = useState(false);

    // zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
        code: "",
      },
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsLoading(true)
        try {
            const response =  await axios.post('/api/verify-code',{
                username : param.username,
                code: data.code
            })
            
            toast.success(response.data.message)
            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message?? "Error verifying code")
        }
        setIsLoading(false)
    }
    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Ask your verification code from <span className='font-semibold'>Mushahid</span></p>
                    </div>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        name="code"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <Input {...field} />
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button className='w-full' type="submit" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                    </form>
                    </Form>
                </div>
                </div>
            );
        </>
    )
}

export default verify