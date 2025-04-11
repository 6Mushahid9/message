import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpires: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[]; 
}

const MessageSchema: Schema<Message> = new Schema({
    content: {type: String, required: true},
    createdAt: {type: Date, required:true, default: Date.now},
});

const UserSchema: Schema<User> = new Schema({
    username: {type: String, required: [true, "Username is required"], trim: true, unique: true},
    email: {type: String, required: [true, "Email is required"], unique: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"]},
    password: {type: String, required: [true, "Password is required"]},
    verifyCode: {type: String, required: true},
    verifyCodeExpires: {type: Date, required: true},
    isVerified: {type: Boolean, default: false},
    isAcceptingMessages: {type: Boolean, default: true},
    messages: [MessageSchema],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;