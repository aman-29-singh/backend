import express from "express";
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


const router = Router();

router.route("/register").post(registerUser)
router.get("/test", (req, res) => {
    res.send("Test route working");
});


export default router


/*The first three step when this route.js file created

step1--   import { Router } from "express";
step-2---  const router = Router();
step-3---   export default router

*/