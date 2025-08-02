/*ye kuch nhi hai bas ye ek utility function banayega aur usko export kar dega toh hum asyncHandler use
karenge async await wala and try{} catch{} wala */

// ye promises wala hai aur niche wala code same hai using try{} and catch{}
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export {asyncHandler}


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