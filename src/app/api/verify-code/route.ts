import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();
    try {
        // find user by username
        const {username, code} = await req.json();
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({success:false, message:"user not found"}, {status: 404});
        } 

        // check if code is correct and not expired
        const isValidCode = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date();
        if(!isCodeNotExpired){
            return Response.json({success:false, message:"code is expired, signup again to get new code"}, {status: 400});
        }
        if(!isValidCode){
            return Response.json({success:false, message:"code is incorrect"}, {status: 400});
        }

        // update user
        user.isVerified = true;
        await user.save();
        return Response.json({success:true, message:"Account verified successfully"}, {status: 200});
    } catch (error) {
        return Response.json({success:false, message:"error checking username"}, {status: 500});
    }
}