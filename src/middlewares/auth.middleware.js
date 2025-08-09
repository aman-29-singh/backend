import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        /*middleware mein next ka kaam hota hai ki apna kaam toh hogya khatam abb aage next jahan par isko leke jana hai leke jao agle middleware mein 
        lekar jaana hai toh agle mein lekar jao ya aapka hogya hai kaam toh response mein lekar jao*/
        /**NOW Token ka access kaise lenge toh token ka access lena bohat aasan hai abb kyu hai aasan because request object 
         * k pass cookies ka accsess hai i.e req.cookie so yeh req.cookie ka access aaya kahan se toh server ne hii toh diya
         * app.js file mein ye middleware use karke i.e app.use(cookieParser()) so abb cookies ka access hogya hai bohat
         *  simple i.e req.cookies se saari cookies ka access user i.e client ko ho jayega because server ne saari cookie ka 
         * access diya user ko by using middleware in app.js file of server i.e app.use(cookieParser())
         * so now user ko kaun si cookie chaiye toh user ko req.cookies.accessToken so ye accessToken kahan se aayi
         * so server ne response mein yahi accessToken hii toh diya tha i.e return res.cookie(accessToken,refreshToken,options)
         * yahi accessTokens etc toh server ne diya tha response mein jab login kiya tha user ne toh toh server ne user
         * ko reponse mein accessToken,refreshToken diya tha jab user ne login kiya tha so cookies mein se accessToken
         * nikal lenge from req object i. req.cookis.accessToken now Note-> ho sakta hai ki cookies k andar accessToken ka
         * access ho aur ho sakta hai cookies k anadar accessToken ka access na ho because ho sakta hai accessToken ye
         * cookies se na aa raha ho i.e ho sakta hai user ek custom Header bhej raha ho server ko i. req.header() iske andar
         * name aur jo bhi aapke header ka naam hai woh aap use kar lijiye so req.header() idhar header ek method hata hai
         * jo user client ko available hota hai aur iss method mein user apne header ka naam aur header bhejta hai
         * so aksar jo header server k pass aaataa haai woh hotta hai "Authorization" so kya hota hai ki user jab request
         * bhejta hai toh request mein header k andar user ek key bhejta hai aur iss key ka naam likhte hai "Authorization"
         * aur "Authoriztion "key k andar iss key ki value mein user Bearer TokenName i.e "AUTHORIZARZATION" key k value mein 
         * Bearer phir space deke Token ka naam bhejte hai in "Authorization " key ki value mein so ye hum jwt.io ki documentation\
         * mein jaakar dekh sakte hai syntax is like Authorization: Bearer <token> ye accessToken aise bhej sakte hai using
         *  header "Authorization" so ye <token> hii humara user ka token hotta haai i.e accessToken,refreshToken
         * sohumein in req.header mein poora Bearer space nhi chaiye humein bas header mein token chaiye ye Bearer space nhi
         * chaiye so yahan par kaam aati hai javascript i.e req.header("Authorization")?.replace("Bearer", "") so idhar
         * header mein jo poora Bearer space tha woh poora replace hogya empty String "" se aur iss empty String "" mein
         * space bhi nhi hai so mil gya humein token
         * 
         */
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        //so cookies k andar accessToken hota hai toh agar cookies nhi hoga toh header mein se accessToken le lenge

        //aur agar token nhi hai toh sidha error throw kar denge
        if (!token) {
            throw new ApiError(401, "unauthorized request")
        }

        //Now agar token hai toh kya karenge toh humein jwt ka use karke puchna padega ki ye token sahi hai ya nhi
        /*aur check karenge ki iss token k andar kya kya information hai because aisa nhi hai ki server ne token bas 
        generate kar diya because jab hum user.model.js i.e user model mein jaakar dekhenge toh server ne 
        generateAccessToken k andar bohat saari information server ne daali thi i.e _id,email,username,fullName
        toh ye sab information server ne AccessToken k andar bheji thi i.e in methods.generateAccessToken() k andar
        so server ne ye saari information return ki thi so abb ye client i.e user jab ye saari information wapaas lega
        toh decode kaarni padegi user ko toh hum use karenge jwt toh jwt.verify() method se verify karega 
        so ye jwt.verify() so kya verify karfanaa haai toh humein 2 argument pass kartenge pehla ki kya verify karaana
        hai toh token verify kaaraana haai toh pehla argument token pass karenge aur doosra argument pass kaarenge
        secretKEY or publicKey Beacuse token toh hum generate kar sakte hai aur uss token k andar information bhi daal 
        sakte hai but uss token ko decode wahi kar payega jiske pass mein woh secretKEY or PUBLICkEY HOGA 
        So jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) abb agar verify ho jayega toh user i.e client ko 
        decoded information mil jayegi so isko naam denge decodedToken */
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        /*so agar user mil gya hai aur decode hogya hai toh client k pass mein user hai poora ka poora but 
        ye field nhi chaiye i.e -password and -refreshToken isliye - use kiye in select
        ye _id (i.e decodedTToken?_id) aaraha hai user.model.js mein jo AccessToken banaya tha aur usmein
        jo _id ko value diya tha wahan se aaraha hai _id
        */

        //now agaar ujser nhi hai so throw error
        if (!user) {
            //discuss about frontend
            throw new ApiError(401, "Invalid Access Token")
        }

        /*now agar itna kaam hogya hai aur yahan par 100% check hogya hai ki user hai hii hai aapke pass mein
         toh client k pass mein access hai n iss request ka toh hum iss request k andar ek naya object add
         kar denge i.e req.user = user so here req.aman naam bhi object ka de skate the but proffesional tha so
         req.user =user i.e user object k andar iss user ka access dedenge phir kaam ho jayega then we add next()
         */
        req.user = user;
        next()
        //so abhi humne ek middleware bana liya hai abb hum routes k pass mein chalenge i.e user.route.js k pass
        //mein middleware add karenge
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
     /**ye separaate middleware isliye banaye because iski humein kahin jagah jarurat padegi aapko ho sakta 
      * hai user se post add karwana ho ya like karna ho kuch bhi karwana ho user se toh humein pata karna padega ki
      *  user authenticated hai ya nhi hai isliye iss functionality ko humne aise idhar separately likha hai
      * aise agar humein sirf ek hi jagah karna padtaa ki sirf ek hii jagah pata karna hai ki user humara loggedIn
      * hai ya nhi hai tohhum ye aise separaate middleware nhi banate
       */

})