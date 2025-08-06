import express from "express"
import dotenv from "dotenv";
import { app } from "./app.js";//import this so that your app is running properly and all routes and controller work properly

//const app = express();//don't configure app here because we already have created app.js file import this app.js file
//require('dotenv').config({path: './env'})
import connectDB from './db/index.js';


dotenv.config()
    

connectDB()//isse mongodb atlas connect hoga aur yeh ek asynchronous method hai
//toh asynchronous method jab bhi complete hota hai toh yeh actually technically humko ek promise bhi return karta hai
.then(()=> {
    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})//if promise resove
.catch((error)=> {
    console.log("MONGO db connection failed !!!", error)
})






/*
import express from 'express';
const app = express();

( ()=> {
    try{
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=> {   //ERROR K LIYE LISTEN KAR RHE HAI
            console.log("ERROR:", error)
            throw error
        })

        app.listen(process.env.PORT, ()=> {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch(error){
        console.error("Error", error)
        throw err
    }
})()

this is a first approach top connect database using in Index.js
In second approach we will connect database in db folder of src folder
*/