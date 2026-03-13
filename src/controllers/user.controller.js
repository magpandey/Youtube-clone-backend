import { User } from "../models/user.model";

import mongoose from "mongoose";
import {asyncHandler} from "../utils/asyncHandler"
import {ApiResponse} from "../utils/ApiResponse"
import {ApiError} from "../utils/ApiResponse"
import { uploadOnCloudinary } from "../utils/cloudinary";


const registerUser = asyncHandler(async(req,res) => { 
    const {username,email,fullName,password} = req.body

    if([username,email,fullName,password].some((field) => field.trim() === "")){
        throw new ApiError(401,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(400,"User already exists")
    }

    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
        const avatarLocalFile = req.files.avatar[0].path

    }
     if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        const coverImageLocalFile = req.files.coverImage[0].path
    }
    const avatar = await uploadOnCloudinary(avatarLocalFile)
    const coverImage = await uploadOnCloudinary(coverImageLocalFile)

    if(!avatar){
        throw new ApiError(402,"avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        username: username.toLowerCase(),
        coverImage: coverImage?.url || "",
        email,
        password
    })

    const registeredUser = await User.findById(user._id).select("-password","-refreshToken")

})