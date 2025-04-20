import {z} from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
    // check if method is GET. usefull for frontend, but now not used in updated Next.js
    // if (req.method !== "GET") {
    //     return Response.json({success: false, message: "Method not allowed"}, {status: 405});
    // }

    await dbConnect();
    try {
        // take username from params, check validity
        const { searchParams } = new URL(req.url);
        const queryParam = searchParams.get("username");
        const result = UsernameQuerySchema.safeParse({ username: queryParam }); 
        if (!result.success) {
            const userNameErrors = result.error.format().username?._errors || [];  
            // // we can use above line to send reasons of invalidation
            return Response.json({ success: false, message: userNameErrors }, { status: 400 });
        }
        
        // check if username exists in db
        const {username} = result.data;
        console.log(username);
        const userFound = await UserModel.findOne({username, isVerified: true});
        if (userFound) {
            return Response.json({success: false, message: "Username already exists"}, {status: 400}); 
        }

        return Response.json({success: true, message: "Username available"});

    } catch (error) {
        // console.error("Error checking username", error);
        return Response.json(
            {success: false, message: "Error checking username" }, 
            { status: 500 }
        )
    }
}