import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

// this function will get all messages of user currently logged in 
// we will only get: {userId, [messages]}  <-- for this we will use aggregation pipeline
export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user as User;
    if(!session || !_user){
        return Response.json({
            message: "Unauthorized",
            success: false,
        },
        {status: 401},);
    }

    // convert string to mongoose object id
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        // below is mongoose aggregation pipeline, this is used to get all messages of a user and sort them
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" }, 
            { $sort: { "messages.createdAt": -1 } },
            { $group: {_id: "$_id", messages: { $push: "$messages" }}}
        ])
        console.log(user);

        if(!user || user.length === 0){
            return Response.json({message: "User not found", success: false},{status: 404},) 
        }

        return Response.json(
            {message: "User found",
            success: true,
            data: user[0].messages},
            {status: 200},)
    } catch (error) {
        return Response.json(
            {message: "unable to fetch meassages", success: false},
            {status: 500},)
    }
}