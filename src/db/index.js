import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";//Database ka naam dene k liye use hota hai


const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        //ye mongoose humein return object dega
        console.log(`\n Mongodb connnected !! DB Host:${connectionInstance.connection.host}`)
        /*ye isliye karte hai taki agar mein agar kahin galti se mein agar production  ki jagah
        kisi aur server par connect ho jau kyunki database jo hai n ye production ka alag hota hai
        development ka alag hota hai testing ka alag hota toh atleast mereko pata rahe ki kaun se host
        par mein connect hoon*/

    } catch(error){
        console.log("MONGODB connection FAILED",error)
        /*Nodejs humko access deta hai process ka toh ye current application ek process par chal rhi hogi
        to yeh process  uss process ka reference hai toh hum process ko exit bhi karwa sakte hai
        so process k exit code hote hai toh hum exit karwaynge 1 se agar Node app fail hogya toh  */
        process.exit(1)
    }
}

export default connectDB;