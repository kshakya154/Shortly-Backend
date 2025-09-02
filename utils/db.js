import mongoose from "mongoose";
async function connectDB(){
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Db connected Succesfully");
  } catch (error) {
    console.log("error while connection to the mongo db")
  }
}

export default connectDB;