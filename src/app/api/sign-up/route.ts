import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerficationEmail";

export async function POST(req: Request) {
    // always check db connection before doing anything 
    await dbConnect();
    try {
        const { email, username, password } = await req.json();

        // check if userName already taken
        const existingUser = await UserModel.findOne({ username, isVerified: true,})
        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username already exists",
            },{ status: 400})
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        // example of working: Math.floor(100000 + Math.random() * 900000) => 123456
        // we made this code here becuase we want to send it to user email later in code
        
        // check if email already taken
        const existingEmail = await UserModel.findOne({ email })
        if (existingEmail) {
            // if email is there and also verified then send a message
            if (existingEmail.isVerified) { 
                return Response.json({
                    success: false,
                    message: "Email already exists with this email",
                },{ status: 400}) 
            }else{
                // if email is there but not verified then update user's password and give them a new verification code
                existingEmail.password = await bcrypt.hash(password, 10);
                existingEmail.verifyCode = verifyCode;
                existingEmail.verifyCodeExpires = new Date(Date.now() + 3600000)
                await existingEmail.save();
                // now we have to send this new verification code to user, program flow will do this later in code
            }
        }

        // now we have really a new user with new unique name and email
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const expiry = new Date()
            expiry.setHours(expiry.getHours() + 1)  
            // expiry is a object of Date so we can updae it even when const
                       
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpires: expiry,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [], 
            })
            await newUser.save();
        }

        // after making user send verification email and check if successfuly sent
        const emailResponse =  await sendVerificationEmail(email, username, verifyCode)
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,  
            },{ status: 500}) 
        }

        // now when a user is made and mail sent then give a success response
        return Response.json({
            success: true,
            message: "User registered successfully",
        },{ status: 200})

    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Error registering user",
        },{ status: 500})
    }
}