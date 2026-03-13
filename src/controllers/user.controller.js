import { User } from "../models/user.model";

import mongoose from "mongoose";
import {asyncHandler} from "../utils/asyncHandler"
import {ApiResponse} from "../utils/ApiResponse"
import {ApiError} from "../utils/ApiResponse"
import { uploadOnCloudinary } from "../utils/cloudinary";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}



    } catch (error) {
        throw new ApiError(500,"unable to generate user refresh token ")
    }
}



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
    if(!registeredUser){
        throw new ApiError(500,"Failed to register user")
    }
    res.status(201).json(new ApiResponse(201,"User registered successfully",registeredUser))
})

const loginUser = asyncHandler(async(req,res) => {
    const {username,email,password} = req.body

    if(!(username && password)){
        throw new ApiError(402,"username and pawword required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(402,"User not found ")
    }

    const isPasswordValid = await  user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(403,"Entered Password is incorrect please try again ")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password","refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }
    return res.status(200).cookie("accessToken" ,accessToken, options)
    .cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{
    user: loggedInUser,accessToken,refreshToken
    },"User logged in successfully"))

})

export {registerUser}