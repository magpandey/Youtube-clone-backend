import { registerUser,loginUser } from "../controllers/user.controller";
import {Router} from "express"


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


