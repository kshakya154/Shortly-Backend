import mongoose from "mongoose";
const urlSchema = new mongoose.Schema({
  shortId:{
    type:String,
    unique:true,
    required:true
  },
  ownerId:{
    type:String,
    required:true
  },
  redirectedUrl:{
    type:String,
    required:true,
  },
  visitHistory:[{timestamp:{type:Number}}]
},
{timestamps:true}
);
const URL=mongoose.model("url",urlSchema);
export default URL;