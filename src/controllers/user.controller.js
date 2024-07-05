import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary"
import { ApiResponse } from "../utils/Apiresponse.js";


//  asyncHandler is a higher orde funcction that will accept another function 
// writing the method to registerUser 
const registerUser = asyncHandler(async (req,res) =>{

//   s1  // //    if data is coming from from or json format is handeled by req.body
    const {fullName,email,username,password} = req.body;
    console.log("email:",email);
// s2
// Validation 
// to check if any of the fields is empty 
// method 1
// if(!fullName || !email || !username || !password){
//     return res.status(400).json({msg:"Please fill in all fields"})
//     }
// method 2
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
    )   {
         throw new ApiError(400, "All fields are required")
        }

//  check if the user is already present in db 
// this is done by User wala varablie, that talks with our mongodb

    const existedUser =  User.findOne({
        // use of operator 
        $or:[ {username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with this username or emial already exist:!")
    }

// s4
//  create a new user
    // Now getting the path of the files from our server where the multer stored the files 
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    // now since the avatar is necessary 
    // but if we do not get the avatarLocalPath then throw error 
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required..!")
    }

    // s5
    // Upload to cloudinary file 
    // sending the file to cloudinary from the server 
    // since it can take time therfore await 
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // chekc for if avatr field is properly uploaded to cloudinary 
    if(!avatar){
        throw new ApiError(400,"Avatar file is required..!")
    }
    // note that we have not checked for coverImage 
    // s6 
    // entering the data in db 
    // now we know that User is the only one talking toi the DB 
    const user = await User.create({
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url ||"",
            email,
            password,
            username:username.toLowerCase()
        })

    // Now to check that if the user is created in db or not 
    const createdUser = await User.findById(user._id)
    .select(" -password -refreshToken ")    //if the user is created iin db , then it will be selected and stored in createdUser
    // but leaving the password , and refreshToken feild they will not be there in createdUser

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user:!")
    }

    // now if the user is created ten send the response 
    // that too in specific format 
    // Since in ApiResponse its allowed to sen the data we can sen hte createdUser

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Succesfully..!")
    )

} )

export {registerUser}