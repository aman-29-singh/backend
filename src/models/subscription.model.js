import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type:Schema.Types.ObjectId,//one who is subscribing
        ref:"User"//i.e User model mein se jo user honge wahi toh subscriber honge
    },
    channel:{
        type:Schema.Types.ObjectId,//one to whom 'subscriber' is subscribing
        ref:"User"//i.e means channel ko subscribe kar rhe hai toh channel bhi toh ek user hii hai
    }
},
    { timestamps: true })


export const Subscription = mongoose.model("Subscription",  subscriptionSchema )