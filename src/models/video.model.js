import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
       videoFile:{
        type:String,
        required:true
       },
        thumbnail:{
        type:String,
        required:true
       },
        thumbnail:{
        type:String,
        required:true
       },
        description:{
        type:String,
        required:true
       },
       duration:{
         type:Number,//from cloudinary
         default:0
       },
       isPublished:{
        type:Boolean,
        default:true
       },
       owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
       }
       
    },
    {
        timestamps:true
    }
)

// here we can write our aggrigate queries  
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)