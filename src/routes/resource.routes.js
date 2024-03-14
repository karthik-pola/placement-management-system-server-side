import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createResource , deleteResource, getResource, updateResource } from "../controllers/resource.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

// router.route('/delete').delete({
//     verifyJWT,
//     deleteResource
// })

router.route("/").get(getResource);

router.route('/update/:resourceId').post(verifyJWT,
    upload.fields([
        {
            name:"attachments"
        },
        {
            name:"coverImage"
        }
    ]),
    asyncHandler(updateResource));

export default router;
