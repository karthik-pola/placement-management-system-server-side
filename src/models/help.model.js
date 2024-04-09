import mongoose, { Schema } from "mongoose";



const helpSchema = new Schema(
    {
        username: {
            type: 'string',
            required: true,
        },
        rollNo:{
            type: 'string',
        },
        email:{
            type: 'string',
            required: true,
        },
        message:{
            type: 'string',
            required: true,
        }
    },
    {
        timestamps:true,
    }
);
export const Help = mongoose.model('helps' , helpSchema);