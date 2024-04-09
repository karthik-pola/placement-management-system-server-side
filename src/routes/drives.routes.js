import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createDrive, deleteDrive, getDrive, updateDrive } from "../controllers/drives.controller.js";
import {  drivesRegistered, registerDrive, registeredBy } from "../controllers/drives.register.controller.js";


const router = Router();

router.route('/create').post(
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

router.route('/update/:driveId').post(upload.fields( [
    {
        name: "attachments"
    },
    {
        name:"coverImage"
    }
]),
updateDrive);

router.route('/').get(getDrive);
// router.route('/').get(verifyJWT , getDrive);

router.route('/register').post(verifyJWT ,registerDrive);

router.route('/registeredDrives').post(drivesRegistered);

router.route("/registeredBy").get(registeredBy)

export default router