import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

export const connectDB = async()=>{
    const connect = await mongoose.connect(process.env.MONGODB_URL)
    if(connect){
        console.log('Connected to MongoDB')
    }else{
        console.log('Failed to connect to MongoDB')
    }
}