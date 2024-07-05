import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app  = express();

// writing the middleware for cors  
app.use(
    cors(
        {
            // konchi resqust from front end to approve 
            origin:process.env.CORS_ORIGIN,
            credentials:true
        }
    )
)

// writing some more things to handel the incoming data 
// via form etc in json format 
app.use(express.json(
    {
        limit:"16kb"
    }
))

// via url 
app.use(express.urlencoded(
    {
        extended:true , limit:"16kb"
    }
))

// in th eform of video or images or favicon 
// we keep them in our static folder here we keep them in public folder 
app.use(express.static('public'))

// using th ec[kiw parser thing  
app.use(cookieParser())

//routes import 
import userRouter from './routes/user.routes.js'

// now before you were doing 
// app.get...app.thing 
// since thoug app you were writing the routes and controllers in same file 
// but now you have separated the routes and controller file 
// NOW TO BRING THE ROUTER YOU HAV E TO USE THE MIDDLEWARE 
app.use("/api/v1/users",userRouter)

export {app}


// export default {app}