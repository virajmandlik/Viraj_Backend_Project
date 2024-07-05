import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


// uploading any type of files

// making of function to get the file path form server 
const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath)
            return null
        //upload to cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        //file has been uploaded seccesfuly
        console.log("File is Uploaded on cloudinary..!"
            ,response.url
        )
        return response
    }catch(error){
        // now we know that file is not uploaded to  cloudinary but file is present on our 
        // server , theefore we should delete it 
        // for that 
        fs.unlinkSync(localFilePath) 
        return null
    }
}
export {uploadOnCloudinary}






















// From the website code refrence 
// **********START ***********
// (async function() {

//     // Configuration
//     cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View Credentials' below to copy your API secret
//     });
    
//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();

// ****************END*****************