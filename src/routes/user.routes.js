import { registerUser,loginUser,logoutUser} from "../controllers/user.controller.js";
import {Router} from "express"
import {verifyJwtToken} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"
const router = Router()

router.route("/register").post(upload.files([{
    name: "avatar",
    maxCount:1
},
{
    name:"coverImage",
    maxCount:1
}]),registerUser)

router.route("/login").get(loginUser)
router.route("/logout").get(verifyJwtToken,logoutUser)


