import mongoose,{Schema} from "mongoose";

const driveschema = new Schema(
    {
        companyName: {
            type: String,
            // required: true
        },
        coverImage:{
            type: String
        },
        description: {
            type: String,
            // required: true
        },
        dateToRegister: {
            type: String,
            // required: true
        },
        lastDateToRegister: {
            type: String,
            // required: true
        },
        venue: {
            type: String,
            // required: true
        },
        links: {
            type: String,
        },
        attachments: {
            type: [String]
        },
        cutOff: {
            type: Number,
            required: true
        },
        
    },
{
    timestamps: true,
});

export const Drives = mongoose.model('Drives', driveschema);

