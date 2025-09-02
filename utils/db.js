import mongoose from "mongoose";
async function connectDB(){
  try {
    await mongoose.connect('mongodb+srv://kshakya154:9855989810@cluster0.kluuyhp.mongodb.net/')
    console.log("Db connected Succesfully");
  } catch (error) {
    console.log("error while connection to the mongo db")
  }
}

export default connectDB;