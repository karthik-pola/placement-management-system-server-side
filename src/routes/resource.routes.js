import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createResource } from "../controllers/resource.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/create').post(
    verifyJWT,
    upload.fields([
        {
            name: "attachments"
        },
        {
            name: "coverImage"
        }
    ]),
    createResource
);

export default router;
