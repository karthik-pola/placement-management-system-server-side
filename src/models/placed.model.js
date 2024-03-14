
import mongoose, {Schema} from 'mongoose';

const PlacedStudentSchema = new Schema(
    {
    driveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drive', 
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', 
        required: true
    }
    },
    {
        timestamps: true,
    }
);


export const PlacedStudent = mongoose.model('placedstudents', PlacedStudentSchema);

