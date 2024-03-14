import mongoose,{Schema} from "mongoose";

const drivesRegisterSchema = new Schema(
    {
        company: {
            type: Schema.Types.ObjectId,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true
        },
        
    },
{
    timestamps: true,
});

export const DrivesRegister = mongoose.model('DrivesRegister', drivesRegisterSchema);