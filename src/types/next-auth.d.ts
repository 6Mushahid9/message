import NextAuth from "next-auth";

// actually we making module of next-auth so we can add our own properties to it
declare module "next-auth" {
  interface User {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
  }
  interface Session {
    user:{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    } & DefaultSession["user"];
  }
}