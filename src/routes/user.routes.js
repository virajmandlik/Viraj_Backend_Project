// s1 
import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
// s2 
// making of variable router 
const router = Router();

// Before 
// router.route("/register").post(registerUser)

// After 
// Adding middleware S
router.route("/register").post(
    // post karaychya adhi mala bhetun za .:.middleware 
    upload.fields(
        [
            {
                name:"avatar",
                maxCount:1 //max kiti files accept karaychya
            },
            {
                name:"coverImage",
                maxCount:1
            }
        ]
    ),
    // ata tu ja post karayl aserver kad 
    registerUser)
// now what s the thign wheater i have to go to /users or to /register >>>>>>
  
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)

// s3 
// export the router 
export default router