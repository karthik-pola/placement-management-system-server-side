import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';

import { ApiResponse } from '../utils/ApiResponse.js';


const registerUser = asyncHandler(async (req , res) => {
    //get user details from frontend
    //validation -not empty
    //check if user already exists: userNme or email
    //check for images , check for avatar
    //upload tem in cloudinary,avatar
    //create user object - create enter in db
    //remove password and refresh token field in response
    //check if user creation
    //return res



    const {fullName , email , userName , password,gender,role} = req.body

    // res.status(200).json({
    //     message: "backend setup is successfully completed"
    // })



    if(
        [fullName , email , userName , password].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{userName} , {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
        gender,
        role,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new Apierror(500, "Something went wrong while registering the user !!!")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser,"User registered successfully")
    )
})


export { registerUser }