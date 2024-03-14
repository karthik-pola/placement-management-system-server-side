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
        return res.status(404).json(new ApiError(400,"resource not found"));
    }

    res.status(200).json(new ApiResponse(200, deletedResource));
})

const updateResource = asyncHandler(async (req, res) => {
    const resourceId = req.params.resourceId; // Assuming you are passing resourceId in the URL

    // Fetch the existing resource from the database
    const existingResource = await Resources.findById(resourceId);

    const { ResourceName, description } = req.body;

    if (!existingResource) {
        throw new ApiError(404, "Resource not found");
    }

    // Check if each field is modified in the request body and update accordingly
    if (ResourceName && ResourceName !== existingResource.ResourceName) {
        existingResource.ResourceName = ResourceName;
    }

    if (description && description !== existingResource.description) {
        existingResource.description = description;
    }

    let attachmentslinks = req.body.attachments || [];

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

    // Update other fields as needed

    if (attachmentslinks.length > 0 && JSON.stringify(attachmentslinks) !== JSON.stringify(existingResource.attachments)) {
        existingResource.attachments = attachmentslinks;
    }

    if (coverImage && coverImage.url !== existingResource.coverImage) {
        existingResource.coverImage = coverImage.url;
    }

    // Save the updated resource only if there are modifications
    if (existingResource.isModified()) {
        await existingResource.save({ validateBeforeSave: false });
        res.status(200).json(new ApiResponse(200, existingResource, "Resource updated successfully"));
    } else {
        res.status(200).json(new ApiResponse(200, existingResource, "No changes made to the resource"));
    }
});



const getResource = asyncHandler(async (req, res) => {
    const resources = await Resources.find();
    if(!resources.length){
        throw new ApiError(404, "Resource not found");
    }
    return res.status(200).json(new ApiResponse(200,{resources : resources}));
});



export { createResource, deleteResource , updateResource ,getResource};
