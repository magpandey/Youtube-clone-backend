import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"

const verifyJwtToken = asyncHandler(async(req,_,next) => {
    try {
        
        const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            throw new ApiError(400,"Unauthorized request")
        }
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodeToken._id).select("-password","-refreshToken")

        if(!user){
            throw new ApiError(400,"Unauthorized request")
        }

        req.user = user
        next()

    } catch (error) {
        throw new ApiError(500," Unable to process the request  ")
    }
})