import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        videoFile:{
            type:String,/// cloudinary url aayega because video ko bhi clioudinary par store karenge
            required:true
        },
        thumbnail:{
            type:String,//cloudinary url
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type:Number,//duration bhi nikalenge cloudinary se
            required:true
        },
        views:{
            type:Number,
            default: 0
        },
        isPublished:{//isPublished told that ki videos public k liye available hai ya nhi
            type:Boolean,//toh hum check karenge ki ye video show karna hai ya nhi iss hisaab se boolean flags hote hai
            default:true
        },
        owner:{//owner of video
            type:Schema.Types.ObjectId,
            ref:"User"//i.e qwner aayega User i.e user.model.js se
        }
    },
    {
        timestamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)//plugins k through aagregate ko add karte hai
//now we can write aggregations queries
//now we will see library bcryptjs and bcrypt
//here bcrypt is foe Nodejs and bcryptjs is for optimized for javascript
//both bcrypt and bryptjs has same working functionality

export const Video = mongoose.model("Video", videoSchema);