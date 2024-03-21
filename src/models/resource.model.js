import mongoose,{Schema} from "mongoose";

const resourceSchema = new Schema(
    {
        ResourceName:{
            type: "string",
            required: true
        },
        coverImage:{
            type: "string"
        },
        attachments:{
            type: ["string"]
        },
        description:{
            type: "string"
        },
        links:{
            type: ["string"] 
        }
    },
    {
    timestamps: true,
});

export const Resources = mongoose.model('Resources', resourceSchema);

