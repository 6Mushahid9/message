import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  // in providers we give just names of services, but here we want our custom made
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // now when we have given custom made credentials, we have to give authorize function
      async authorize(credentials: any): Promise<any>{        
        await dbConnect();
        try {
            // find user by credentials
            const user = await UserModel.findOne({ 
                $or:[
                  {email: credentials.identifier},
                  {username: credentials.identifier},
                ] 
            })

            // check if user is found and verfied
            if(!user){
                throw new Error("User not found");
            }
            if(!user.isVerified){
                throw new Error("User not verified");
            }

            // return user if password is correct
            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
            if(!isPasswordCorrect){
                throw new Error("Invalid credentials");
            }else{
                return user;
            }

        } catch (error: any) {
            throw new Error(error);
        }
      }
    }) 
  ],

  // if we want to use custom signin/signout... pages rather than defaults then tell here
  pages: {
    signIn: "/sign-in",
  },

  // jwt is default but we can also use database
  session: {
    strategy: "jwt",
  },

  // callbacks are used to modify the session and token 
  // generally token is kept small for low traffic but then we have to fetch it from db multiple times
  // so (according to video) we can make it powerful and store it in session
  // now if i have access to jwt or session i will have all the details of user to work with
  callbacks: {
    // put details from user to jwt
    async jwt({ token, user }) {
      if(user){
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username; 
      }
      return token; 
    },
    // put details from jwt to session
    async session({ session, token }) {
        if(token){
          session.user._id = token._id;
          session.user.isVerified = token.isVerified;
          session.user.isAcceptingMessages = token.isAcceptingMessages;
          session.user.username = token.username;
        }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}