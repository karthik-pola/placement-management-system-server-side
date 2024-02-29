import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createDrive, deleteDrive, getDrive, updateDrive } from "../controllers/drives.controller.js";


const router = Router();

router.route('/create').post(verifyJWT ,
    upload.fields( [
        {
            name: "attachments"
        },
        {
            name:"coverImage"
        }
    ]),
    createDrive
)

router.delete('/delete/:driveId',verifyJWT, deleteDrive);

router.route('update/:driveId').post(verifyJWT,updateDrive);

router.route('/').get(verifyJWT , getDrive);

export default router