import express from "express";
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "..//middlewares/multer.middleware.js" //ye middleware bich mein use hota hai

const router = Router();

router.route("/register").post(//ye method registerUser execute hone se pehle hum ek upload middleware lagaa denge
    upload.fields([ //field matlab 2 file upload kar rha hoon apne server pe isliye upload.field
        //yahan pe 2 file accept kar rha hoon ek avatar aur doosra coverImaage toh mere 2 object aayenge
        {
            name:"avatar",//toh jo first file hum lenge isko hum avatar naam se janege toh jo humara frontend ka field banega jab React ya kisimein design karenge toh uska naam avatar hoga
            maxCount:1//yeh batayega ki kitni file aacept karoge hum is avatar field mein toh hum 1 hii file accept karenge
        },
        {
            name:"coverImage",
            maxCount:"1"//so yeh coverImage mein kitni file lenge yeh bataayega ye maxCount
        }
        //toh ab hum images i.e user images send kar sakta hai in request of /register routes par
    ]),//so iss tarah middleware inject karte hai ki jo bhi method i.e registerUser execute ho rha hai isse just pehle middleware upload ko use karlo 
    registerUser //ye controller ka method hai jo middleware k baad execute hoga
)
/*router.get("/test", (req, res) => {
    res.send("Test route working"); //route ko check karne k liye
});*/


export default router


/*The first three step when this route.js file created

step1--   import { Router } from "express";
step-2---  const router = Router();
step-3---   export default router

*/