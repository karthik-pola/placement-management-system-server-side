import mongoose,{Schema} from "mongoose";

const driveschema = new Schema(
    {
        companyName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        dateToRegister: {
            type: Date,
            required: true
        },
        lastDateToRegister: {
            type: Date,
            required: true
        },
        venue: {
            type: String,
            required: true
        },
        links: {
            type: String,
        },
        attachments: {
            type: [String]
        }
    },
{
    timestamps: true,
});

export const Drives = mongoose.model('JobApplication', driveschema);

