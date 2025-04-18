import dbConnect from "@/lib/dbConnect";
import UserModel, {Message} from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();
    const {username, content} = await req.json();

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                message: "User not found",
                success: false, 
            },{status: 404},) 
        }

        // now check if user is accepting messages
        if(!user.isAcceptingMessages){
            return Response.json({
                message: "User is not accepting messages",
                success: false,
            },{status: 404},)
        }

        const newMessage = {content, createdAt: new Date()} as Message;
        user.messages.push(newMessage);
        await user.save();
        
        return Response.json({
            message: "Message sent",
            success: true,
        },{status: 200},)
    } catch (error) {
        return Response.json({
            message: "Unable to send message",
            success: false, 
        },{status: 500},)
    }
}