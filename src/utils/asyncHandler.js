const asyncHandler = (requestHandler)=>{
    // returning as a fucntion 
     return (req, res, next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err ))
    }
}

export {asyncHandler}

//********************** */ BY TRY CATCH METHOD 

// const asyncHandler = ()=>{}
// // to pass another function as call 
// const asyncHandler = ()=>()=>{}
// // to make it async 
// const asyncHandler = ()=>async()=>{}

    // const asyncHandler =(fn)=>async(req,res,next)=>{
    //     try{
    //         await fn(req,res,next)

    //     }catch(error){
    //         res.status(error.code || 500).json({
    //             success:false,
    //             message:error.message
    //         })
    //     }
    // }
