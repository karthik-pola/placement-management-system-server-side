import { Router } from "express";
import { createPlacementFromExcel, getPlacedStudentsByBranch, getPlacedStudentsCount, getUserAndDriveDetailsForPlacedStudents } from "../controllers/placed.controller.js";
import { upload } from "../middlewares/multer.middleware.js";





const router = Router();

router.route('/').post(upload.single("placedData"),createPlacementFromExcel)
router.route("/placedCount").post(getPlacedStudentsCount);
router.route("/drive-details").post(getUserAndDriveDetailsForPlacedStudents)

router.route("/searchByBranch").get(getPlacedStudentsByBranch);


export default router;