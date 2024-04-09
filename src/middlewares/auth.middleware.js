import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";

export const verifyJWT = asyncHandler(async(req,_,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log(token);
        if(!token) {
           throw new ApiError(401, "Unauthorized: Missing access token") 
        }
    
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized: Invalid access token");
        }

        console.log("Token: " +decodedToken);
        
        if(decodedToken.role ==="admin"){
            const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")
            if(!admin) {
                throw new ApiError(401, "Unauthorized: admin not found")
            }
        
            req.admin = admin;
        }
        else{
            console.log("decodedToken :" ,decodedToken);
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
            if(!user) {
                throw new ApiError(401, "Unauthorized: User not found")
            }
        
            req.user = user;
        }



        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Unauthorized: Invalid access token")
    }
    
})