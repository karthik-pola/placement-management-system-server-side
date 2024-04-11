import mongoose from "mongoose";
import { Drives } from "../models/drives.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import nodemailer from 'nodemailer';
import Mailgen from "mailgen";
import { generateMail } from "../middlewares/mail.middleware.js";
import { User } from "../models/user.model.js";



// const generateMail = async (Name, Intro, Message, Outro) => {
//     let config = {
//         service: 'gmail',
//         auth: {
//             user: 'placement4645@gmail.com',
//             pass: 'oawywnmrvnbwmyvl',
//         }
//     }

//     const transporter = nodemailer.createTransport(config);

//     let MailGenerator = new Mailgen({
//         theme: "default",
//         product: {
//             name: "Training and placement department",
//             link: "https://mailgen.js/"
//         }
//     })

//     let response = {
//         body: {
//             name: Name,
//             intro: Intro,
//             action: {
//                 instructions: Message,
//                 button: {
//                     color: '#22BC66',
//                     text: 'Register for the new drive',
//                     link: 'https://your-website.com/register'
//                 }
//             },
//             outro: Outro
//         }
//     }

//     let mail = MailGenerator.generate(response);

//     let message = {
//         from: 'placement2024@gmail.com',
//         to: "karthikpola07@gmail.com",
//         subject: "New Drive Notification",
//         html: mail
//     }

//     transporter.sendMail(message)
//         .then(() => {
//             return console.log("Mail sent successfully")
//         })
//         .catch(err => {
//             console.log(err);
//         })
// }



const createDrive = asyncHandler(async (req, res) => {
    const { companyName, description, dateToRegister, lastDateToRegister, venue, links } = req.body;

    let attachmentslinks = [];
    if (req.files && Array.isArray(req.files.attachments) && req.files.attachments.length > 0) {
        for (let i = 0; i < req.files.attachments.length; i++) {
            const attachmentsImageLocalPath = req.files.attachments[i].path;
            const temp = await uploadOnCloudinary(attachmentsImageLocalPath);
            attachmentslinks.push(temp.url);
        }
    }

    const coverImagePath = req.files?.coverImage[0]?.path;
    const coverImage  = await uploadOnCloudinary(coverImagePath);

    const drive = await Drives.create({
        companyName,
        description,
        coverImage:coverImage?.url,
        attachments: attachmentslinks, // Store Cloudinary URLs in the 'attachments' field
        dateToRegister,
        lastDateToRegister,
        venue,
        links,
    });

    
    
    const createDrive  = await Drives.findById(drive._id);
    if (!createDrive) {
        throw new ApiError(500, "Something went wrong while creating the drive !!!")
    }
    console.log(createDrive);

    const users = await User.find();

    console.log(users);

    users.map(user =>{
        console.log(user.email);
        generateMail(user.email , "Pola" , "new drive has been created" , description ,"apply now ",  `Form closes at ${lastDateToRegister}` )
    });

    
    res.status(201).json(
        new ApiResponse(200, createDrive,"Drive created successfully")
    )
});


const deleteDrive = asyncHandler(async (req, res) => {
    const { driveId } = req.params;

    // Find the drive by its ID and delete it
    const deletedDrive = await Drives.findByIdAndDelete(driveId);

    if (!deletedDrive) {
        // If the drive with the given ID doesn't exist, return a 404 Not Found response
        return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    // Return a success response
    res.json({ success: true, data: deletedDrive });
});


const updateDrive = asyncHandler(async (req, res) => {
    const { companyName, description, dateToRegister, lastDateToRegister, venue, links} = req.body;
    const driveId = req.params.driveId;
    // const driveId = req.params.driveId;
    // console.log("Drive ID: " + driveId);
    // const id = new mongoose.Types.ObjectId(driveId)
    // Assuming driveId is defined somewhere in your code

    console.log("dsbjdbfbh" ,companyName);
    const existingDrive = await Drives.findByIdAndUpdate(driveId , 
    {
        $set: {
            companyName: companyName,
            description: description,
            dateToRegister: dateToRegister,
            lastDateToRegister: lastDateToRegister,
            venue: venue,
            links: links
        }
    },
    {new:true}
    );

//     if (!existingDrive) {
//         return res.status(404).json(ApiResponse(404, {}, "Drive not found"));
//     }

//     if (companyName && existingDrive.companyName !== companyName) {
//         existingDrive.companyName = companyName;
//     }
//     if (description && existingDrive.description !== description) {
//         existingDrive.description = description;
//     }
//     // Handle attachments if needed
//     // ...

//     if (dateToRegister && existingDrive.dateToRegister !== dateToRegister) {
//         existingDrive.dateToRegister = dateToRegister;
//     }
//     if (lastDateToRegister && existingDrive.lastDateToRegister !== lastDateToRegister) {
//         existingDrive.lastDateToRegister = lastDateToRegister;
//     }
//     if (venue && existingDrive.venue !== venue) {
//         existingDrive.venue = venue;
//     }
//     if (links && existingDrive.links !== links) {
//         existingDrive.links = links;
//     }

//     try {
//         await existingDrive.save({ validateBeforeSave: false });
//         return res.status(200).json(new ApiResponse(200, { drive: existingDrive }, "Drive updated successfully"));
//     } catch (error) {
//         // Handle validation or save errors
//         return res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
//     }
// });

    return res.status(200).json(new ApiResponse(200, existingDrive, "Drive updated successfully"));
});


// const getDrive = asyncHandler(async(req, res)=>{
//     const drives = await Drives.find();
//     const user = req?.user;
//     if(user.role === 'admin'){
//     if (!drives.length) {
//         throw new ApiError(404, "Drive not found");
//     }
//     return res.status(200).json(new ApiResponse(200, { drive: drives}));
//     }
//     else{
//         if (!drives.length) {
//             throw new ApiError(404, "Drive not found");
//         }
//         return res.status(200).json(new ApiResponse(200, { drive: drives}));
//         }   
//     }
// );

// const getDrive = asyncHandler(async (req, res) => {
//     const drives = await Drives.find();
//     const user = User.findById( req?.user._id);
//     console.log(user._id);
    
//     if (!drives.length) {
//         throw new ApiError(404, "Drive not found");
//     }

//     if (user.role === 'admin') {
//         return res.status(200).json(new ApiResponse(200, { drive: drives }));
//     } else {
//         // Filter drives based on cutoff percentage
//         const filteredDrives = drives.filter(drive => drive.cutoff <= user.percentage);

//         if (!filteredDrives.length) {
//             throw new ApiError(404, "No drives match cutoff percentage");
//         }

//         return res.status(200).json(new ApiResponse(200, { drive: filteredDrives }));
//     }
// });


// const getDrive = asyncHandler(async (req, res) => {
//     const drives = await Drives.find();
//     const user = req?.user // Await the result of the query
//     // console.log(user._id);

//     if (!drives.length) {
//         throw new ApiError(404, "Drive not found");
//     }

//     if (!user) {
//         throw new ApiError(404, "User not found");
//     }

//     if (user.role === 'admin') {
//         return res.status(200).json(new ApiResponse(200, { drive: drives }));
//     } else {

//         const student = await User.findById(req?.user._id);
//         // Filter drives based on cutoff percentage
//         const filteredDrives = drives.filter(drive <= drive.cutOff <= student.percentage);

//         if (!filteredDrives.length) {
//             throw new ApiError(404, "No drives match cutoff percentage");
//         }

//         return res.status(200).json(new ApiResponse(200, { drive: filteredDrives }));
//     }
// });


const getDrive = asyncHandler(async (req, res) => {
    const drives = await Drives.find();
    const user = req?.user;

    if (!drives.length) {
        throw new ApiError(404, "Drive not found");
    }

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role === 'admin') {
        return res.status(200).json(new ApiResponse(200, { drive: drives }));
    } else {
        const student = await User.findById(req?.user._id);
        console.log(student);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        // Filter drives based on cutoff percentage
        const filteredDrives = drives.filter(drive => drive.cutOff <= student.percentage);

        if (!filteredDrives.length) {
            throw new ApiError(404, "No drives match cutoff percentage");
        }

        return res.status(200).json(new ApiResponse(200, { drive: filteredDrives }));
    }
});












export {
    createDrive,
    deleteDrive,
    updateDrive,
    getDrive  
};