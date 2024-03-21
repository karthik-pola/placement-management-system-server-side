import mongoose, { Schema } from "mongoose";



const alertsSchema = new Schema(
    {
        message:{
            type: 'string',
            required: true,
        },
        createdBy:{
            type: 'string',
            required: true,
        }
    },
    {
        timestamps:true,
    
    }
);

export const Alert = mongoose.model('alerts', alertsSchema);