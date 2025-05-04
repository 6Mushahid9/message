import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

// method to toggle "accepting-messages" boolean
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

    // in our case we got state of boolean from frontend so store as it is
    const userId = user._id
    const {acceptmessages} = await request.json();
    console.log(userId)
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessages: acceptmessages},{new: true});

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


// method to just check if user is accepting messages, for this user existence is required session is not
export async function GET(request: Request) {
    await dbConnect();
  
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
  
    if (!username) {
      return Response.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }
  
    try {
      const foundUser = await UserModel.findOne({ username });
      if (!foundUser) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }
  
      return Response.json(
        {
          success: true,
          isAcceptingMessages: foundUser.isAcceptingMessages,
          message: "User found",
        },
        { status: 200 }
      );
    } catch (error) {
      return Response.json(
        { success: false, message: "Failed to get message status" },
        { status: 500 }
      );
    }
  }
  