import { PlacedStudent } from '../models/placed.model.js';
import { User } from "../models/user.model.js";
import Excel from 'exceljs';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { Drives } from '../models/drives.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createPlacementFromExcel = async (req, res) => {
    const excelFilePath = req.file?.path;

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(excelFilePath);

    const worksheet = workbook.getWorksheet(1);
    const placedData = [];

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        console.log('Row Number:', rowNumber, 'Worksheet Row Count:', worksheet.rowCount);
        const row = worksheet.getRow(rowNumber);
        if (!row) {
            console.log('Row not found, breaking loop.');
            break; // Break the loop if the row is not found
        }

        const [rollNumber, driveId] = row.values.slice(1, 3);

        const user = await User.findOne({ "rollNo": rollNumber });
        if (!user) {
            throw new Error(`User with roll number ${rollNumber} not found`);
        }

        const drive = await Drives.findOne({ "_id": new mongoose.Types.ObjectId(driveId)});
        if (!drive) {
            throw new ApiError(400, "Drive not found");
        }

        console.log("User ID:", user._id, "Drive ID:", drive._id);

        const data = {
            userId: user._id,
            driveId: drive._id
        };
        placedData.push(data);
        await PlacedStudent.create(data);
    }

        return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            placedData,
            "User logged In Successfully"
        )
    )

    

};


const getPlacedStudentsCount = async (req, res) => {
    try {
        const placedStudentsCount = await PlacedStudent.aggregate([
            {
                $group: {
                    _id: "$userId",
                    userId: { $first: "$userId" } // Keep the first userId encountered in each group
                }
            },
            {
                $group: {
                    _id: null, // Group all documents into a single group
                    count: { $sum: 1 } // Count the number of documents in the group
                }
            }
        ]);

        return res.status(200).json(placedStudentsCount[0]); // Return the count as a single document
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};




const getUserAndDriveDetailsForPlacedStudents = async (req, res) => {
    try {
        const placedStudentsWithDetails = await PlacedStudent.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "drives",
                    localField: "driveId",
                    foreignField: "_id",
                    as: "drive"
                }
            },
            {
                $unwind: "$drive"
            },
            {
                $project: {
                    fullName: "$user.fullName",
                    rollNo: "$user.rollNo",
                    companyName: "$drive.companyName"
                }
            }
        ]);

        return res.status(200).json(placedStudentsWithDetails);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



const getPlacedStudentsByBranch = async (req, res) => {
    try {
        const branch = req.body; // Assuming branch is provided in the request params

        const placedStudentsByBranch = await PlacedStudent.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $match: {
                    "user.branch": branch // Filter by branch
                }
            }
        ]);

        return res.status(200).json(placedStudentsByBranch);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};




export { 
    createPlacementFromExcel ,
    getPlacedStudentsCount ,
    getUserAndDriveDetailsForPlacedStudents,
    getPlacedStudentsByBranch
 };




