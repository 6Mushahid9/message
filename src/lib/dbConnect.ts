import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected");
        return;
    }   try{
        const db = await mongoose.connect(process.env.MONGO_URI!);
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB");
    }   catch (error) {
        console.log("Connection failed", error)
        process.exit(1);
    }
}

export default dbConnect;