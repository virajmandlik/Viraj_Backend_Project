import mongoose, {Schema} from "mongoose";

const  subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, //jo subscribe karto to
        ref:"User"
    },
    // imp channeel is alos the one of subscriber 
    channel:{
        type:Schema.Types.ObjectId,//Onne to whom subscriber is subsribing
        ref:"User"
    }
},{timestamps:true}
)

export const Subscription = mongoose.model('Subscription', subscriptionSchema);