import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true
    },
    fullName:{
        type:String,
        unique:true,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    watchHistory:[{
        type: Schema.Types.ObjectId,
        ref:"Video"
    }]
},{timestamps: true})









export  const {User} = mongoose.model("User",userSchema) 