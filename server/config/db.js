import mongoose from "mongoose";

const connectDB =async ()=> {
    try{
                console.log("Connected to MongoDB...");

        await mongoose.connect(process.env.MONGODB_URI);


    }

    catch(error){
        console.log("Error connecting to MongoDB:", error.message);

    }
}

export default connectDB;