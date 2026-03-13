import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"
const userSchema = new Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        trim:true,
        required: true,
        index:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String
    },
    watchHistory:[{
        type: Schema.Types.ObjectId,
        ref:"Video"
    }]
},{timestamps: true})


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()

        this.password = await bcrypt.hash(this.password,10)
        next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    await bcrypt.compare(password,this.password)
}



userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname:this.fullname
        },process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){ 
    return jwt.sign(
        {
            _id:this.id
        },process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export  const {User} = mongoose.model("User",userSchema) 