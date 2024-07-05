// s1 
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

// s2 
// making of variable router 
const router = Router();

router.route("/register").post(registerUser)
// now what s the thign wheater i have to go to /users or to /register >>>>>>
  

// s3 
// export the router 
export default router