import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: { params: { messageid: string } }) {
  const { messageid } = context.params;

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as User & { _id: string };

  if (!session || !user?._id) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }

  try {
    const result = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Message not found", success: false }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully", success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ message: "Error deleting message", success: false }, { status: 500 });
  }
}
