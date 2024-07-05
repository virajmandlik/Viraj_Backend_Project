import mongoose  from "mongoose";
import express from 'express'
import { DB_NAME } from "./constants.js";
import connectDB from "../src/db/index.js";
import app from './app.js'


// imporatnt :! 
// As early as possible in your application, import and configure dotenv: 
// you can use this syntax.. and you connection will be succesfull..
// require('dotenv').config ()
// but since you are using the import more :.then in beech me reqiure  so to mainteain consistentcy we do this
// import 'dotenv/config'
import dotenv from 'dotenv'

dotenv.config({path:'./env'})

// mathod 2 
connectDB()
.then(
    ()=>{
        app.listen(process.env.PORT || 8000,()=>{
            console.log(`Server is running at the port ${process.env.PORT}`)
        })
    }
)
.catch((err)=>{
    console.log("MONGODB CHA CONNECTION FAILED ZALH..!",err)
});





// methid 1 
// but using this you have olluted the index file 
// // creation of iffes fucntion 
// const app = express(); 
// (
//     async ()=>{
//         try{
//             await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//             app.on("error",(error)=>{
//                 console.log('"Error in db connection',error)
//                 throw error
//             })
//             app.listen(process.env.PORT){
//                 console.log(`APP Is lisening on ${process.env.PORT}`)
//             }
//         }catch(error){
//             console.log('Error in db connection',error) 
//             throw error
//         }
//     }
// )()