import { Router } from "express";
import { 
    loginAdmin, 
    logoutAdmin,
    registerAdmin, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentAdmin, 
    updateAdminAvatar, 
    updateAdminCoverImage, 
    // getWatchHistory, 
    updateAccountDetails,
    getAdminDetails,
    deleteAdmin
} from "../controllers/admin.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerAdmin
    )

router.route("/login").post(loginAdmin)
router.route("/admin-details").post(getAdminDetails)
router.route("/deleteUser/:admin_id").delete(deleteAdmin);
router.route("/logout").post(verifyJWT,  logoutAdmin)

router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-admin").get(verifyJWT, getCurrentAdmin)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAdminAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateAdminCoverImage)


export default router