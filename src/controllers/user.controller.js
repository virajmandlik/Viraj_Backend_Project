import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponse.js";
import mongoose from "mongoose";
import { json } from "express";
import jwt from "jsonwebtoken"


//  asyncHandler is a higher orde funcction that will accept another function 
// // writing the method to registerUser 
// const registerUser = asyncHandler(async (req,res) =>{

// //   s1  // //    if data is coming from from or json format is handeled by req.body
//     const {fullName,email,username,password} = req.body;
//     // console.log("email:",email);
// // s2
// // Validation 
// // to check if any of the fields is empty 
// // method 1
// // if(!fullName || !email || !username || !password){
// //     return res.status(400).json({msg:"Please fill in all fields"})
// //     }
// // method 2
//   if (
//     [fullName, email, username, password].some((field) => field?.trim() === "")
//     )   {
//          throw new ApiError(400, "All fields are required")
//         }

// //  check if the user is already present in db 
// // this is done by User wala varablie, that talks with our mongodb

//     const existedUser =  await User.findOne({
//         // use of operator 
//         $or:[ {username}, {email}]
//     })

//     if(existedUser){
//         throw new ApiError(409,"User with this username or emial already exist:!")
//     }

// // s4
// //  create a new user
//     // Now getting the path of the files from our server where the multer stored the files 
//     const avatarLocalPath = req.files?.avatar[0]?.path;

//     // const coverImageLocalPath = req.files?.coverImage[0]?.path;
//     let coverImageLocalPath;
//     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//         coverImageLocalPath = req.files.coverImage[0].path
//     }
//     // now since the avatar is necessary 
//     // but if we do not get the avatarLocalPath then throw error 
//     if(!avatarLocalPath){
//         throw new ApiError(400,"Avatar file is required..!")
//     }

//     // s5
//     // Upload to cloudinary file 
//     // sending the file to cloudinary from the server 
//     // since it can take time therfore await 
//     const avatar = await uploadOnCloudinary(avatarLocalPath)
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath)

//     // chekc for if avatr field is properly uploaded to cloudinary 
//     if(!avatar){
//         throw new ApiError(400,"Avatar file is required..!")
//     }
//     // note that we have not checked for coverImage 
//     // s6 
//     // entering the data in db 
//     // now we know that User is the only one talking toi the DB 
//     const user = await User.create({
//             fullName,
//             avatar:avatar.url,
//             coverImage:coverImage?.url ||"",
//             email,
//             password,
//             username:username.toLowerCase()
//         })

//     // Now to check that if the user is created in db or not 
//     const createdUser = await User.findById(user._id)
//     .select(" -password -refreshToken ")    //if the user is created iin db , then it will be selected and stored in createdUser
//     // but leaving the password , and refreshToken feild they will not be there in createdUser

//     if(!createdUser){
//         throw new ApiError(500,"Something went wrong while registering the user:!")
//     }

//     // now if the user is created ten send the response 
//     // that too in specific format 
//     // Since in ApiResponse its allowed to sen the data we can sen hte createdUser

//     return res.status(201).json(
//         new ApiResponse(200,createdUser,"User registered Succesfully..!")
//     )

// } )

const generateAccessAndRefreshTokens = async (userId)=>{
    try {
        // 1) generating tokens 

        const user =  await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        // now we keep acess token to ourself but save this refresh token in db 
        // so that baar baar password n dalna pade 

        // 2) Saving refreshToken into DB 
        // adding the refresh token inside user 
        user.refreshToken = refreshToken
        // to save this user , 
        // user.save()
        // hume pata he ki humne bass iski 
        // refresh token hi update kara he update kara he, but in saving it will check for password too
        // for that 
        await user.save({ValidatebeforSave:false })

        // 3) returning the tokens 
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access tokens")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);
// try1 start
    // const avatarFiles = req.files;
    // const avatarFile = avatarFiles?.avatar?.[0];
    // const avatarLocalPath = avatarFile?.path; 
// end 
    //  method 1 to get the path
    // const avatarLocalPath = req.files?.avatar[0]?.path;

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }
    // method 2 to get the path...easy to understand 
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is lagti")
    }
    // console.log(avatarLocalPath)
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required.:!")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req,res)=>{
    // my algorithm
    // 1. from the request body that is re body->data
    // 2. username or email
    // 3.FInd the user from the db
    // 4. if user is not found then throw error
    // 5. if user is found then check the password
    // 6. if password is correct then generate the Acess and Refresh Tokens for them
    // 7. Send the tokens in form of Cookie

    // yet i have not decided that on what basis there will be my login 
    const {email,username,password} = req.body

    // dono me se ek to needed 
    if(!(username || email)){
        throw new ApiError(400,"Username or email is required")
    }

    // now to find the user in db on basis of email 
    // User.findOne({email})
    // now to find the user in db on basis of username
    // User.findOne({username})

    // but how to find user on basis of either the email or the username
    // we can use the operators of mongodb
    // $or operator
    // $or operator is used to perform logical OR operation on an array of expressions.
    // It is used to match any one of the expressions in the array.
       const user =  await User.findOne({
        $or:[{email},{username}]
    })

    // agar inn dono ko milkarkar bhi agra user ke andar kuch nahi aya then user not found 
    if(!user){
        throw new ApiError(400,"User not found") 
    }
    // now to check the password
    // now all the metods i have created are with user 
    // they arec not with User  ..its the mongoose ka agent to talk to debugger,
    // its not your agent 
    const isPasswordValid =  await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid User Creditaials") 
    }

    // now the user is present and i have to generate the accesss and refresh token for it 
    // this is most oftenly doneso i am writing the function for that

     const{accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    //  now sending back the logged in user with required number of feilds only 
    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

    // Now to send the cookies 
    // but befoe that i have to set there propreties 
    const options = {
        // ab bas ye cookies view only he , 
        // not modifiable from server only thriugh server tey are modifiable 
        httpOnly:true,
        secure:true,
    }
    // now to send the cookies
    return res
    .status(200)
    .cookie("accessToken",accessToken,json)
    .cookie("refreshToken",refreshToken,json)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User Logged In Succesfully.:!"
        )
    )

})

const logoutUser = asyncHandler(async (req,res)=>{
    // removig the data of refreshToken from db
       await User.findByIdAndUpdate(
        req.user._id,
        {
            //  using the operator of mongo db 
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        // ab bas ye cookies view only he , 
        // not modifiable from server only thriugh server tey are modifiable 
        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(
        200,//ststus code
        {},//no data send
        "User Logged Out"//message
    ))

    // i could wirte the  middleware of verfiy user here also but i was needing it ,
    // not only in case of logut but aslo in determing the find out which user like the post ,
    // or condition where i need to verify the user 
    
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    // now to get the refresh token from thte requested frontend, 
    // we will get it from cokkies of it
    // also what if some one is accesing it from mobile then we will bet it from the body of request 

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    // jar mala to bhetlach nahi tar 
    if(!incomingRefreshToken)
        throw new ApiError(401,"Unautorized kaam zalh..!")

// since hence forht kaam can be come error so we use the try catch mehtod for this

   try {
     // since me front end la encrypted token takla hota so mala request madhi pan encrypted token ch tar bhetnar
     // and i want to compare it with db  me store token 
     // for that i need to decode the incoming refreshtoken 
     const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
 
     // now since in generateRefreshToken  i have provided only IdleDeadlineso i will retrive only the id 
     // and find the refresh token in db for that user 
     const user = await User.findById(decodedToken?._id) // ?._id means if decodedToken is not null then get the id from it
     
     if (!user)
         throw new ApiError(401,"Invalid Refresh token bhtel:.!")
 
     // checking both of the tokens
     if(incomingRefreshToken !==user?.refreshToken)
         throw new ApiError(401,"Refresh token is expired or used:!")
 
     // now if they are matching then generate new tokens 
     // now we have to send them in cookies 
     // for that we have to write the options for that cookies 
     const options  = {
         httpOnly:true,
         secure:true
     }
 
     // genersating new access and refresh tokens 
     const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
 
      return res
      .status(200)
      .cookie("accessToken",accessToken),options
      .cookie("refreshToken",newrefreshToken,options)
      .json(
         new ApiResponse(
             200,
             {accessToken,newrefreshToken},
             "Access token successfully..!"
         )
      )
   } catch (error) {
    throw new ApiError(401,"invalid refresh token dil n bho tu..!")
   }

})

export {registerUser ,loginUser,logoutUser,refreshAccessToken }