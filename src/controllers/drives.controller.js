import { Drives } from "../models/drives.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
        throw new Apierror(500, "Something went wrong while creating the drive !!!")
    }
    console.log(createDrive);
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
    const { companyName, description, dateToRegister, lastDateToRegister, venue, links } = req.body;
    const driveId = req.params;
    // Assuming driveId is defined somewhere in your code
    const existingDrive = await Drive.findById(driveId);

    if (!existingDrive) {
        return res.status(404).json(ApiResponse(404, {}, "Drive not found"));
    }

    if (companyName && existingDrive.companyName !== companyName) {
        existingDrive.companyName = companyName;
    }
    if (description && existingDrive.description !== description) {
        existingDrive.description = description;
    }
    // Handle attachments if needed
    // ...

    if (dateToRegister && existingDrive.dateToRegister !== dateToRegister) {
        existingDrive.dateToRegister = dateToRegister;
    }
    if (lastDateToRegister && existingDrive.lastDateToRegister !== lastDateToRegister) {
        existingDrive.lastDateToRegister = lastDateToRegister;
    }
    if (venue && existingDrive.venue !== venue) {
        existingDrive.venue = venue;
    }
    if (links && existingDrive.links !== links) {
        existingDrive.links = links;
    }

    try {
        await existingDrive.save({ validateBeforeSave: false });
        return res.status(200).json(ApiResponse(200, { drive: existingDrive }, "Drive updated successfully"));
    } catch (error) {
        // Handle validation or save errors
        return res.status(500).json(ApiResponse(500, {}, "Internal server error"));
    }
});


const getDrive = asyncHandler(async(req, res)=>{
    const drives = await Drives.find();

    if (!drives.length) {
        throw new ApiError(404, "Drive not found");
    }
    return res.status(200).json(new ApiResponse(200, { drive: drives}));
});








export {
    createDrive,
    deleteDrive,
    updateDrive,
    getDrive  
};