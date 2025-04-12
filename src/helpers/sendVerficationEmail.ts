import {resend} from "@/lib/resend"  
import VerificationEmail from "../../mailTemplates/verificationEmail"
import { ApiResponse } from "@/types/apiResponse"

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username, otp:verifyCode}),
        })
        return{
            success: true,
            message: "Verification email sent",
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Error sendeing verification email",
        }
    }
}