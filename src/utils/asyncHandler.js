/*ye kuch nhi hai bas ye ek utility function banayega aur usko export kar dega toh hum asyncHandler use
karenge async await wala and try{} catch{} wala */

// ye promises wala hai aur niche wala code same hai using try{} and catch{}
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export {asyncHandler}



/* chatgpt explanation ---->
const asyncHandler = (requestHandler) => { above function work like this
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    };
};

export { asyncHandler };


---------------------Usage of above function---->
import express from 'express';
import { asyncHandler } from './utils/asyncHandler.js';

const app = express();

app.get('/user', asyncHandler(async (req, res) => {
    const user = await getUserFromDB(); // might throw
    res.json(user);
}));


 */


/*now humein code ko standardized karwana hai i.e api ka error bhi mein standardized karna chahta hoon
aur api ka response bhi mein standardized karwana chahta hoon toh thoda sa code humein likhna padega
but isse fayda hoga ki jo humara codebase hai woh standardized ho jata hai like jo humara api ka response aayega 
toh ek particular format mein aayega aur agar api ka error aayega toh woh bhi ek particular format mein aayega
like pehle status code then  Success Code,aur phir error message jaise niche define kiye hai format
iske liye Nodejs humein ek Error class deta hai iss Error class ka use karke hum api error ko format
kar sakte hai so hum utils folder mein ek file banayenge i.e ApiError.js file mein api se error aane wali 
code ko format karne wala code likhenge  */


/* const asyncHandler = (fn) => () => {}
    This is like--
    const asyncHandler = () => {}
    const asyncHandler = (func) => { () => {} } this {} ye samajne k liye next step mein remove hoga yeh {}
    const asyncHandler = (func) => () => {}
    const asyncHandler = (func) => async () => {}


        const asyncHandler = (func) => { //it explain more clearly
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (err) {
            next(err); // pass error to Express error handler
        }
    };
};

//explanation by chatgpt---
2. async (req, res, next) (Wrapper Function)
This is the function returned by asyncHandler.

It takes in the Express arguments: req, res, next.

It calls func(req, res, next) inside a try-catch block to catch any errors.

🔗 Relationship Between Them
Here’s a diagram-style breakdown:

app.get('/route', asyncHandler(func));
Step-by-step:
1.func is your original route handler function.

2.asyncHandler(func) wraps func and returns a new function (req, res, next) => { ... }.

3.When the route /route is hit, Express calls the wrapper function.

The wrapper function:

Receives req, res, and next,

Tries to run func(req, res, next),

Catches any errors and passes them to next().

🎯 Purpose of Having Two Functions
Function	                    Role
func(req, res, next) --->	Your actual route logic (user-defined async code)
async (req, res, next)-->	The middleware wrapper that calls func and handles errors



----> asyncHandler() is a higher-order function — it returns middleware.

-----> The returned function is the actual middleware that gets used in your route.



✅ Final Summary:
   Part	                       Type	                             Description
asyncHandler	        Higher-order function	         Takes a handler and returns a middleware
requestHandler	             Callback	                      The actual async logic (your route)
(req, res, next) => {.. }	✅ Middleware	  The wrapper function that catches errors and passes them to next()

        */


 /*       

 
//its a wrapper function jo hum har jagah use karenge
const asyncHandler = (fn) => async (req, res, next) => {
    try{
        await fn(req, res, next)
    } catch(error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}  
    */