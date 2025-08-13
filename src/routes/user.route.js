import express from "express";
import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "..//middlewares/multer.middleware.js" //ye middleware bich mein use hota hai
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(//ye method registerUser execute hone se pehle hum ek upload middleware lagaa denge
    upload.fields([ //field matlab 2 file upload kar rha hoon apne server pe isliye upload.field
        //yahan pe 2 file accept kar rha hoon ek avatar aur doosra coverImaage toh mere 2 object aayenge
        {
            name:"avatar",//toh jo first file hum lenge isko hum avatar naam se janege toh jo humara frontend ka field banega jab React ya kisimein design karenge toh uska naam avatar hoga
            maxCount: 1//yeh batayega ki kitni file aacept karoge hum is avatar field mein toh hum 1 hii file accept karenge
        },
        {
            name:"coverImage",
            maxCount: 1//so yeh coverImage mein kitni file lenge yeh bataayega ye maxCount
        }
        //toh ab hum images i.e user images send kar sakta hai in request of /register routes par
    ]),//so iss tarah middleware inject karte hai ki jo bhi method i.e registerUser execute ho rha hai isse just pehle middleware upload ko use karlo 
    registerUser //ye controller ka method hai jo middleware k baad execute hoga
)
/*router.get("/test", (req, res) => {
    res.send("Test route working"); //route ko check karne k liye
});*/


//now humein ek aur new route add karna hai /login route
router.route("/login").post(loginUser)
/*abhi muje kuch aise routes hai jo user ko dene hai jab user login ho aur login ka verification kaise karunga
apne auth middleware se login ka verification karunga user ka token hai aur token hii toh ek tarika hai 
janeka ki user login ho ya nhi ho toh isko hum secured routes bolenge */

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)//so ye verifyJWT middleware ye logoutUser se pehle chal jayega
//so ye verifyJWT middleware ye logoutUser se pehle chal jayega phir middleware ki next ki wajah se logoutUser chalega baad mein
//ye verifyJWT middleware ye auth.middleware.js se aayega 
router.route("/refresh-token").post(refreshAccessToken)//yahan par verifyJWT Ka middleware nhi lagayenge


export default router


/*The first three step when this route.js file created

step1--   import { Router } from "express";
step-2---  const router = Router();
step-3---   export default router

*/