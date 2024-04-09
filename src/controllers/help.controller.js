import { Help } from "../models/help.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";





const createHelp = asyncHandler(async (req,res) =>{
    const {username , rollNo , email , message} = req.body;
    // console.log(user);
    const help = await Help.create ({
        username,
        message,
        email,
        rollNo
    });

    if(!help){
        throw new ApiError(500 , "something went wrong while creating alert")
    }

    console.log(help);

    return res
    .status(201)
    .json(new ApiResponse( 200, help , "help creates successfully"));
})



const getHelps = asyncHandler(async (req,res) =>{
    const helps = await Help.find();
    if(!helps.length){
        throw new ApiError(404 , "no alerts found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, helps));
});


const deleteHelp = asyncHandler(async (req, res) => {
    const help_id = req.params.help_id;
    console.log(typeof help_id);

    // Use await to execute the query and get the deleted resource
    const deletedHelp = await Help.findByIdAndDelete(help_id);

    // Check if the resource was found and deleted
    if (!deletedHelp) {
        return res.status(404).json(new ApiError(400, "help not found"));
    }

    // Send the deleted resource in the response
    res.status(200).json(new ApiResponse(200, deletedHelp));
});


export {
    createHelp,
    getHelps,
    deleteHelp
} 