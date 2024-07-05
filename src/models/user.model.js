import mongoose,{Schema} from "mongoose";

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowerCase:true,
            trim:true,
            index:true
            // for optimizing the searchin gin db index true 
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowerCase:true,
            trim:true
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String, //cloudinary url
            required:true
        },
        coverImage:{
            type:String, //cloudinary url
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

// just jheva data store honar hota mi tua madhhe changes kele by using hooks of mongoose 
userSchema.pre("save", async function(next){
    // it means ki jab bhi bass password change ho thabi usko encypt karo 
    if(!this.isModified("password")) return next();

    // 10 means ki 10 rounds of encryption chalo
    this.password = await bcrypt.hash(this.password,10)
})

// checking the password enterd by user is mathcing with that of satored passord 
userSchema.methods.isPasswordCorrect = async function
(password){
    // bcypt jar hash karu shakte tar check pan karu shakte 
    // it returns the Boolean value 
    return await bcrypt.compare(password,this.password)
}

//making the tokens
userSchema.methods.generateAccessToken = function(){
    // jar error ala tar async laun bagh return kartana******************8
    return jwt.sign(
        // giving the payload 
        {
            _id:this.id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        // giving the access token 
        process.env.ACCESS_TOKEN_SECRET,
        // expiry of access token 
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY  
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        // giving the payload , since its refreshes every time dont need to give ectra data
        {
            _id:this.id
        },
        // giving the access token 
        process.env.REFRESH_TOKEN_SECRET,
        // expiry of access token 
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY  
        }
    )
}
export const User = mongoose.model("User",userSchema)