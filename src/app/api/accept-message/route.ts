import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

// method to toggle accepting messages boolean
export async function POST(request: Request) {
    await dbConnect();

    // want current logged in user
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if(!session || !session.user){
        return Response.json(
            {success: false, message: "Unauthorized"},
            {status: 401}
        )
    } 

    const userId = user._id
    const {acceptmessages} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            {isAcceptingMessages: acceptmessages},
            {new: true}
        );

        if(!updatedUser){
            return Response.json(
                {success: false, message: "User not found"},
                {status: 404}
            )
        }

        return Response.json(
            {success: true, message: "Accepting messages boolean toggled successfully"},
            {status: 200}
        )
    } catch (error) {
        return Response.json(
            {success: false, message: "Failed to toggle the accepting message boolean"}, 
            {status: 500}
        )
    }
}


// method to just check if user is accepting messages
export async function GET(request: Request) {
    await dbConnect();

    // want current logged in user
    const session = await getServerSession(authOptions);
    const user = session?.user as User; 
    if(!session ||!session.user){
        return Response.json(
            {success: false, message: "Unauthorized"},
            {status: 401}
        ) 
    }

    try {
        const userId = user._id;
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json(
                {success: false, message: "User not found"},
                {status: 404}
            )
        } 
        return Response.json(
            {success: true, isAcceptingMessages: user.isAcceptingMessages, message: "User found", user: foundUser},
            {status: 200} 
        )
    } catch (error) {
        return Response.json(
            {success: false, message: "Failed to get message accepting status"},
            {status: 500} 
        )
    }
}