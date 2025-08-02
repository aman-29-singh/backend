
import dotenv from "dotenv";

//require('dotenv').config({path: './env'})
import connectDB from './db/index.js';


dotenv.config()
    

connectDB();





/*
import express from 'express';
const app = express();

( ()=> {
    try{
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=> {
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