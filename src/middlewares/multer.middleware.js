import multer from "multer"
  

// we can use the memory storage here for small files 
// but for lasrge files , precaution we use the disk storage 

// from the npm website , we got the code 
const storage = multer.diskStorage({
    // cb is call back 
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        // to kep the file on server with different name 
    //    cb(null, file.fieldname + '-' + uniqueSuffix)

    // but for now , save with the same name
       cb(null, file.originalname)
    }
  })
  
 export const upload = multer({ 
   storage, 
})