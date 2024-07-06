// s1 
import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
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
// could used the verifyJWT if you have to verify via the id and thne refrehed , but here insided it ihvae veified alsredy , thats why not used the 
// middlewasre jwtverify 
router.route("/refresh-token").post(refreshAccessToken)
// s3 
// export the router 
export default router