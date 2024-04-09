import { Router } from "express";
import { logoutUser, registerUser,loginUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage,  createUserFromExcel, getStudentData, deleteUser, updateEducationalDetails, updatePersonalDetails } from "../controllers/user.controller.js";
import  {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registeredBy } from "../controllers/drives.register.controller.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/update-user-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/update-user-coverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/user-details").get(getCurrentUser)

router.route("/createUser").post(upload.single("userData"),createUserFromExcel);

router.route("/studentData").get(getStudentData);

router.route("/deleteUser/:user_id").delete(deleteUser);

router.route("/update/educationalDetails").post(verifyJWT ,updateEducationalDetails)

router.route("/update/personalDetails").post(verifyJWT ,updatePersonalDetails);



export default router