import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import Excel from 'exceljs';
// import Excel from 'exceljs';
import * as xlsx from 'xlsx';
import { generateMail } from '../middlewares/mail.middleware.js';
 



const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


// const registerUsers = asyncHandler(async (req , res) => {
//     //get user details from frontend
//     //validation -not empty
//     //check if user already exists: userNme or email
//     //check for images , check for avatar
//     //upload tem in cloudinary,avatar
//     //create user object - create enter in db
//     //remove password and refresh token field in response
//     //check if user creation
//     //return res

//     const {fullName , email , userName , password,gender,role,personalEmail,rollNo} = req.body

//     // res.status(200).json({
//     //     message: "backend setup is successfully completed"
//     // })



//     if(
//         [fullName , email , userName , password].some((field) => field?.trim() ==="")
//     ){
//         throw new ApiError(400,"All fields are required")
//     }

//     const existedUser = await User.findOne({
//         $or: [{userName} , {email}]
//     })
//     if(existedUser){
//         throw new ApiError(409, "User already exists")
//     }

//     const avatarLocalPath = req.files?.avatar[0]?.path;
//     let coverImageLocalPath;
//     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//         coverImageLocalPath = req.files.coverImage[0].path
//     }
//     if (!avatarLocalPath){
//         throw new ApiError(400,"Avatar file is required")
//     }

//     const avatar = await uploadOnCloudinary(avatarLocalPath);
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath);
//     if(!avatarLocalPath){
//         throw new ApiError(400,"Avatar file is required")
//     }

//     const user = await User.create({
//         fullName,
//         avatar: avatar.url,
//         coverImage: coverImage?.url || "",
//         email,
//         password,
//         userName: userName.toLowerCase(),
//         gender,
//         role,
//         personalEmail,
//         rollNo
//     })

//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     )

//     if(!createdUser) {
//         throw new Apierror(500, "Something went wrong while registering the user !!!")
//     }

//     return res.status(201).json(
//         new ApiResponse(200, createdUser,"User registered successfully")
//     )
// })

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName , email , userName , password,gender,role,personalEmail,rollNo } = req.body
    console.log("email: ", email , userName , password , gender , role , personalEmail);


    if (
        [fullName, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
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
        personalEmail,
        rollNo
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    generateMail(createdUser.email , createdUser.userName , "your account have been created successfully" ,"visit our site a access all the features" ,"Click Here " , "for more details visit our site")

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )




function readExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
}

// // Function to create users from parsed data
// function createMultipleUsers(req, res) {
//     const filePath = req.file?.path;
//     try {
//         const userData = readExcel(filePath);
//         for (const data of userData) {
//             // Create user document based on your schema
//             const user = new User({
//                 userName: data.userName,
//                 email: data.email,
//                 fullName: data.fullName,
//                 // Add other fields as needed
//             });
//             // Save user to database
//             const usedata = user.save();
//             console.log(`User ${data.userName} created successfully.`);
//         }
//         console.log("All users created successfully.");
//     } catch (error) {
//         console.error("Error creating users:", error);
//     }
// }


const createUserFromExcel = async (req, res) => {
    const excelFilePath = req.file?.path;

    

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(excelFilePath);

    const worksheet = workbook.getWorksheet(1);

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        if (!row) {
            console.log('Row not found, breaking loop.');
            break; 
        }

        console.log(row.values);

        const [userName, fullName, email, rollNo,password,personalEmail] = row.values.slice(1, 7); // Adjust slice indices based on your Excel structure
        const newUser = new User({
            userName:String(userName),
            fullName:String(fullName),
            email:String(email?.text),
            rollNo:String(rollNo),
            password:String(password),
            personalEmail:String(personalEmail?.text)
        });
        try {
            await newUser.save();
            console.log(`User with email ${email.text} created successfully.`);
            generateMail(email?.text , userName , "your account have been created successfully" ,"visit our site a access all the features" ,"Click Here " , "for more details visit our site")
        }
        
        catch (error) {
            console.error(`Error creating user: ${error.message}`);
            // You can choose to handle errors as per your application's requirements
        }
    }

    return res.status(200).json({
        message: 'Users created successfully'
    });
};


// const loginUser = asyncHandler(async (req, res) =>{
//     // req body -> data
//     // username or email
//     //find the user
//     //password check
//     //access and referesh token
//     //send cookie

//     const {email, username, password} = req.body
//     console.log(email);

//     if (!username && !email) {
//         throw new ApiError(400, "username or email is required")
//     }
    

//     const user = await User.findOne({
//         $or: [{username}, {email}]
//     })

//     console.log("debuging the user:" , user);

//     if (!user) {
//         throw new ApiError(404, "User does not exist")
//     }

//    const isPasswordValid = await user.isPasswordCorrect(password)

//    if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid user credentials")
//     }

//    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

//     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//     const options = {
//         httpOnly: true,
//         secure: true
//     }

//     return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//         new ApiResponse(
//             200, 
//             {
//                 user: loggedInUser, accessToken, refreshToken
//             },
//             "User logged In Successfully"
//         )
//     )

// })


const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    // const user = await User.findOne({
    //     $or: [{username}, {email}]
    // })

    const user = await User.findOne({"email": email})

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    console.log(user);

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    console.log(accessToken , refreshToken)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})


const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});



const updateEducationalDetails = asyncHandler(async(req, res) => {
    // const User = req.user;
    const {oneOne , oneTwo ,twoOne , twoTwo ,threeOne , threeTwo ,fourOne , fourTwo} = req.body

    console.log(`User ${oneOne} ${oneTwo}`)
    

    // if (!fullName || !email) {
    //     throw new ApiError(400, "All fields are required")
    // }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                oneOne : oneOne || req.user.oneOne,
                oneTwo : oneTwo || req.user.oneTwo,
                twoOne : twoOne || req.user.twoOne,
                twoTwo : twoTwo || req.user.twoTwo,
                threeOne : threeOne || req.user.threeOne,
                threeTwo : threeTwo || req.user.threeTwo,
                fourOne : fourOne || req.user.fourOne,
                fourTwo : fourTwo || req.user.fourTwo,
            }
        },
        {new: true}
        
    ).select("-password")

    // console.log(user)

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Educational details updated successfully"))
});



const updatePersonalDetails = asyncHandler(async(req, res) => {
    // const User = req.user;
    const {department , email ,gender , rollNo ,phoneNo , placed ,personalEmail , course ,address,fullName} = req.body
    

    // if (!fullName || !email) {
    //     throw new ApiError(400, "All fields are required")
    // }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                department : department || req.user.department,
                email : email || req.user.email,
                gender : gender || req.user.gender,
                rollNo : rollNo || req.user.rollNo,
                phoneNo : phoneNo || req.user.phoneNo,
                placed : placed || req.user.placed,
                personalEmail : personalEmail || req.user.personalEmail,
                course : course || req.user.course,
                address : address || req.user.address,
                fullName : fullName || req.user.fullName,
            }
        },
        {new: true}
        
    ).select("-password")

    // console.log(user)

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Educational details updated successfully"))
});





const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})


const getUser = asyncHandler(async(req,res) => {
    const {id} = req.body;
    const user = await User.findById(id);
    return user;
})


const getStudentData = asyncHandler(async(req,res) => {
    const data  = await User.find();
    return res
    .status(200)
    .json(
        new ApiResponse(
            200
            ,data
            ,
            "data fetched succesfully"
            )
    )
});

const deleteUser = asyncHandler(async(req,res) => {
    const user_id = req.params.user_id;
    const deletedUser = await User.findByIdAndDelete(user_id);
    if(!deletedUser){
        return res.status(404).json(new ApiError(400,"user not found"));
    }

    res.status(200).json(new ApiResponse(200,deletedUser));
});
 

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    createUserFromExcel,
    getStudentData,
    deleteUser,
    updateEducationalDetails,
    updatePersonalDetails,
}