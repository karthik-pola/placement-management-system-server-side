import { DrivesRegister } from "../models/drives.register.model.js";
import { User } from "../models/user.model.js";
import { Drives } from "../models/drives.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import Excel from 'exceljs';
import stream from 'stream';
import { generateMail } from "../middlewares/mail.middleware.js";

// import mongoose,{Aggregate, Schema} from "mongoose";

const registerDrive = asyncHandler(async (req, res) => {
    const drive_id = req.body.drive_id;
    const user = req.user?._id;

    console.log(drive_id , user);
    
    const driveRegistered = await DrivesRegister.create({
        company:drive_id,
        user
    });

    const registerDrive  = await DrivesRegister.findById(driveRegistered._id);
    if (!registerDrive) {
        throw new ApiError(500, "Something went wrong while registering the drive !!!")
    }

    const student = await User.findById(user);
    const drive  = await Drives.findById(drive_id);
    
    console.log(registerDrive);
    generateMail(student.email , student.userName , `you have sucessfully registered for ${drive.companyName}.` ,  "For more drive" ,"Click here ",  " " )
    res.status(201).json(
        new ApiResponse(200, registerDrive,"Drive registered successfully")
    )

});


const drivesRegistered = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        console.log("User not found");
        throw new ApiError(404, "User not found");
    }

    console.log("User:", user);

    try {
        const data = await User.aggregate([
            {
                $match: {
                    _id: user._id
                }
            },
            {
                $lookup: {
                    from: "drivesregisters",
                    localField: "_id",
                    foreignField: "user",
                    as: "drivesRegistered"
                }
            },
            {
                $unwind: "$drivesRegistered"
            },
            {
                $lookup: {
                    from: "drives",
                    localField: "drivesRegistered.company",
                    foreignField: "_id", // Assuming company field in drivesregisters is an ObjectId
                    as: "driveDetails"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    driveDetails: { $push: "$driveDetails" }
                }
            },
        ]);
        console.log("registered drives" , data);
        if (!data?.length) {
            throw new ApiError(404, "No drives registered for this user");
        }

        return res.status(200).json(new ApiResponse(200, data, "Data fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Error fetching drives registered for the user", error);
    }
});





const drivesRegisteredByStudent = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        
        const data = await DrivesRegister.find({ user: user?._id });
        
        console.log(data[0]);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching drive registration data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





const registeredBy  = asyncHandler(async(req, res) => {
    const driveId = req.body.driveId;
    console.log(driveId);

    try {
        const data = await Drives.aggregate([
            {
                $match: { 
                    _id: new mongoose.Types.ObjectId(driveId) 
                }
            },
            {
                $lookup: {
                    from: "drivesregisters",
                    localField: "_id",
                    foreignField: "company",
                    as: "details"
                }
            },
            {
                $unwind:"$details"
            },
            {
                $lookup: {
                    from: "users", // Assuming the collection name is "users"
                    localField: "details.user", // Assuming "user" field in "details" is the ObjectId of the user
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $project: {
                    _id: 0,
                    userDetails: 1
                }
            }
        ]);


        res.status(200).json(data);
        
    } catch (error) {
        throw new ApiError(500, "Error fetching drive details", error);
    }
});



const fetchUsersByDriveId = asyncHandler(async(req , res) => {
    const driveId = req.params.drive_id;
    console.log(driveId);
    try {
        const users = await DrivesRegister.aggregate([
            {
                $match: {
                    company: new mongoose.Types.ObjectId(driveId) // Assuming driveId is provided by the user
                }
            },
            {
                $lookup: {
                    from: 'users', // Assuming the collection name is 'users' where user details are stored
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: '$userDetails._id',
                    userName: '$userDetails.userName',
                    email: '$userDetails.email',
                    fullName: '$userDetails.fullName',
                    avatar: '$userDetails.avatar',
                    coverImage: '$userDetails.coverImage',
                    password: '$userDetails.password',
                    role: '$userDetails.role',
                    personalEmail: '$userDetails.personalEmail',
                    rollNo: '$userDetails.rollNo',
                    address: '$userDetails.address',
                    gender: '$userDetails.gender',
                    course: '$userDetails.course',
                    about: '$userDetails.about',
                    department: '$userDetails.department',
                    phoneNo: '$userDetails.phoneNo',
                    oneOne: '$userDetails.oneOne',
                    oneTwo: '$userDetails.oneTwo',
                    twoTwo: '$userDetails.twoTwo',
                    threeOne: '$userDetails.threeOne',
                    threeTwo: '$userDetails.threeTwo',
                    fourOne: '$userDetails.fourOne',
                    fourTwo: '$userDetails.fourTwo',
                    palced: '$userDetails.palced',
                    offers: '$userDetails.offers',
                    createdAt: '$userDetails.createdAt',
                    updatedAt: '$userDetails.updatedAt',
                    __v: '$userDetails.__v'
                }
            }
        ]);
        
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
});











export {
    registerDrive,
    drivesRegistered,
    registeredBy,
    drivesRegisteredByStudent,
    fetchUsersByDriveId
};
