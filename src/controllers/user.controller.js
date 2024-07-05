import { asyncHandler } from "../utils/asyncHandler.js";


//  asyncHandler is a higher orde funcction that will accept another function 
// writing the method to registerUser 
const registerUser = asyncHandler(async (req,res) =>{
    res.status(200).json({
        message:"Done Viraj"
    })
} )

export {registerUser}