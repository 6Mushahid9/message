import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

// secret used in [...nextauth]/options
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req, secret });

  if (!token || !token._id) {
    return Response.json(
      { message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(token._id as string);

  // below is the aggregation pipeline to get all messages of a user and sort them by createdAt
  try {
    const allMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }
    ]);
           
    if (!allMessages || allMessages.length === 0) {
      return Response.json(
        { message: "No message found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "User found",
        success: true,
        data: allMessages[0].messages
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Unable to fetch messages", success: false },
      { status: 500 }
    );
  }
}
