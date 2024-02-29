import { Resources } from "../models/resource.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";




const createResource = asyncHandler(async (req, res) => {
    const { ResourceName, description,links } = req.body;
    console.log("yes you did")

    let attachmentslinks = [];
    if (req.files && Array.isArray(req.files.attachments) && req.files.attachments.length > 0) {
        for (let i = 0; i < req.files.attachments.length; i++) {
            const attachmentsImageLocalPath = req.files.attachments[i].path;
            const temp = await uploadOnCloudinary(attachmentsImageLocalPath);
            attachmentslinks.push(temp.url);
        }
    }
    console.log(attachmentslinks);
    const coverImagePath = req.files?.coverImage[0]?.path;
    const coverImage = await uploadOnCloudinary(coverImagePath);

    // Assuming 'links' is defined and assigned a value
    console.log(ResourceName);
    const resource = await Resources.create({
        ResourceName,
        description,
        coverImage: coverImage?.url,
        attachments: attachmentslinks, // Store Cloudinary URLs in the 'attachments' field
        links,
    });

    // Remove the unused variable
    // const createResource = await Drives.findById(drive._id);

    if (!resource) {
        throw new ApiError(500, "Something went wrong while creating the resource !!!")
    }

    console.log(resource);
    res.status(201).json(
        new ApiResponse(200, resource, "Resource created successfully")
    );
});

const deleteResource = asyncHandler(async (req,res) =>{
    const resource_id = req.params
    const deletedResource = Resources.findByIdAndDelete(resource_id);

    if(!deletedResource){
        return res.status(404).json(new ApiError())
    }
})

export { createResource };
