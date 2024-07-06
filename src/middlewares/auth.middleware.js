import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"


// now in csee yo dont user the res in your code in function you can replace it with _ underscore 
export const verifyJWT = asyncHandler(async (req,_,next)=>{

   try {
     const token =req.cookies ?.accessToken || req.header("Authorization")?.replace("Bearer ","");
     // the above code does the follwoing work
     // 1. if the user has a cookie named accessToken then it will take that cookie and
     // 2. if the user has a header named Authorization then it will take that header and
 
     if(!token)
         throw new ApiError(401,"Unauthorized request")
 
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     // to get the user id from the the decoded token 
     const user =  await User.findById(decodedToken?._id).select("-password -refreshToken")
 
     if(!user)
         throw new ApiError(401,"Invalid Acess Token")
 
     req.user = user
     next()  
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid access token...!")
   }  

})