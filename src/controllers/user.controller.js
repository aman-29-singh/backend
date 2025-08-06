import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
const registerUser = asyncHandler( async (req, res)=> {
    /**challenge itna hai ki humein user ko register karna hai but ye dikhne mein itna sa challenge hai but
     * itna nhi hai because ye challenge k steps bohat hai yahi chiz hai jo humari logic building exercise mein help
     * karti hai so prblem hai register karna user ko abb iss problem ko small small step mein hum kaise break
     * karte hai aur phir kaise usko solve karte hai--
     * Steps to solve problem of register the user i.e --
     * step1-- Get user details from frontend so postman se hum user ka detail lena padega so user ka detail
     * hum kaun kaun se detail lenge ye depend karega kis tarah se humne user.model.js i.e kis tarh se humne
     * user model banaya hai aur user model k andar muje kya kya chaiye like username,email,fullname etc aur
     * dekhenge  kya kya required hai woh user se lenge aur kuch fields like watchHistory,refreshToken ye sab field 
     * mein required:true nhi hai means ye sab field hum programitically add karenge so user ek baar register hoga
     * tab toh humein refreshToken,watchHistory ki jarurat nhi hogi but baki chize chaiye so pata lag gya ki
     * user se detail leni hai aur kya kya detail mleni hai
     * 
     * step2-- validation laagaana padega so validation kaise ki user ne kahin empty toh nhi bhej diya username ,ya 
     * empty toh nhi bhej diya emaail ko user ne, ya email correct format mein hai ya nhi ya jitne bhi aur
     * possible validation hai so ye validation frontend par bhi lagte hai butt agaar frontend se miss hogye isliye
     * backend par humne validation laga diya So atleast ek validation hum yahan dekhenge ki sab kuch empty toh
     * nhi hai toh hum yahan check karenge -- not empty 
     * 
     * step3-- check if user is already existt or not i.e kahin user ka already account toh nhi bana hua user ka
     * kaahin woh user doobaraa se register toh nhi kar rha toh ye check karna hii padega warna user ko message
     * kaise dunga ki your account has already been existed toh kaise check karenge so email se check kar sakte hai
     * ki email unique hai kya ya username se bhi check kar sakte hai agar username jyada important hai aur unique 
     * hona chaiye like in instagram to dono se check karlenge i.e check with username aand email that if user is already exist or not
     * 
     * step-4 abb check karna padega ki humari files hai ya nhi jo multer k through humari server par files aayi user ki
     * toh files se mera matlab hai ki hum 2 file le rhe hai user se i.e ek file le rhe hai avatar aur doosra le rhe hai
     * uska coverImage aur ye dono files mein avatar ye required haii.e required:true toh humein check karna padega ki avatar
     * hai ya nhi so abse pehle we check for images and then next step hoga check for avatar yeh avatar compulsory hai
     * 
     * step-5 agar ye avatar files available hai humare server par toh upload them to cloudinary so yahi toh karna 
     * padega ki cloudinary par image bhejoge so already humne iske liye utils folder mein ek utility bana rakhi hai
     * i.e cloudinary.js so ismein dekhenge utility mein toh ye cloudinary humein wapas se ek reponse mil jata 
     * hai yahan pe i.e return response aur ye response mein se humein url nikalana padega i.e jo bhi mage ya file 
     * humne cloudinary par upload kiya hai toh cloudinary iss uploaded image ya file ka ul bana kar humein response mein
     * bhej deta hai i.e return response aur iss response mein se humein url nikalnaa padega isko hum console.log() karke
     * dekh sakte, aur cloudinary  par successfully humein check karna padega ki avtar upload hua hai ya nhi
     * i.e upload them to cloudinary,aavatar toh pehle toh file user ne diya toh user ne diya toh humare multer ne usko
     * upload kiya sahi se ya nhi humare server par yeh check karna padega aur phir multer k baad ek cloudinary par 
     * bhi check laga denge so technically hum ek aise situation par pahuch gye hai ki user ne muje data diya meine image li
     * aur image ko cloudinaary par upload kar diya aur phir cloudinary se image wapas aagayi hai mere pass mein 
     * abb muje ek user object banana padega i.e next step
     * 
     * step-6 create user object {} yeh object isliye banana padega kyunki mongodb mein jab mein data bhejunga
     * toh no sql databases hai toh ismein object hii jyada tar banye jate hai aur upload kiye jate hai toh
     * woh objects banane k baad mein karunga ek creation call i.e create entry in database so muje
     * db calls bhi padhne padenge kis tarah se db hota hai jyada kuch nhi .create itna sa hii kaam hai
     * so user create hogya toh user jab bhi iss tarah se create hota hai toh iske saath obvious si baat 
     * hai humne email diya hai password diya hai toh jo response milta hai humko toh jo jitna bhi create hua 
     * hai database mein woh as it is as a response mil jata hai toh password bhi mil jayega haala ki password
     * encrypted hai humara in database humne already iske liye take care kar liya hai but ye encrypted password
     * bhi mein user ko toh as a response mein nhi dena chahunga encrypted password
     * 
     * step-7 Remove password and refresh token field from response i.e jab user crete hone par hum jo response 
     * user ko denge toh iss response mein hum password and refresh token field ye dono field hum response mein se 
     * hata denge
     * 
     * step-8 toh jo response aaya hai i.e humne password and refresh token ye dono field toh response mein se hata
     * diye abb abb ye jo response aaya hai toh check karo ki response aaya hai ya nhi aya agar response nhi aaya hai
     * toh kya user create hua hai ya nhi hua hai successfully
     * i.e check for user creation ki null response aayaa hai ya actual mein user create hogya hai agar hogya haai
     * user create tab toh return karna padega humein response toh response return kar denge
     * aur agar user create nhi hua hai toh error bhej doo
     * so yaeh haai actually mein logic building jab humne poore steps ko ek baar step by step humne breakdown kiya hai
      SO ABB HUMARe pass Algorithim aagai hai iss registerUser logic k liye i.e iss registerUser k liye yeh logic algorithim 
      rahegi that is this steps follow karna hii algorithim hai
    */
   //step1-- get user details from frontend so user details humein saari ki saari request k andar milti hai
   //req.body//ismein req.body saaari detail mil jati hai jati bhi body se aati hai
   //form se data aayega ya phir direct json se data aarha hai toh humein req.body mein mil jayega
    const { fullName, email, username, password }= req.body
    console.log("email:", email);//ye frontend se aaraha hai isko check kar rhe hai 
    //toh postman mein se data bhejne k liye hum body par jayenge then we can select formData,raw etc but abhi k liye raw select
    //karenge so raw select karenge aur text ki jagah json select karenge {"email": "aman@gmail"} phir ye http://localhost:8000/api/v1/users/register
    //toh because of console.log() server mein email:aman@gmail.com aayega

    //STEP-2  abb user ki details aagayi toh abb karna hai validation 
    // toh validation kaise karenge ki ek ek field ko check karna hai ki woh field empty toh nhi hai
    /*
    if(fullName === ""){
      throw new ApiError(400,"fullName is required")//i.e statuscode and message pass kar denge iska response banke mil jayega
      //yeh api error ka Response bankar dedega because errore is fullNmae==="" toh iss error ka response banakr dedega
  
    } */ //yeh bohat siply check kar rhe hai but bohat saare fields check karne hai isliye 
     
    if(
      [fullName, email, username, password].some((field)=> //ye callback function sab field k upar chalega i.e username,fullname etc 
        field?.trim() === "")//it checks ki field i.e username,email etc yeh empty hai kya
    ){
      throw new ApiError(400,"All fiels are required")
    }
    //Note- aur bhi validation likh sakte hai jaise email mein @ hai include hai ya nhi ye validation se check kar sakte hai
    //so production level code mein ek validation ki separate files hoti hai unn files k andar se method call kar lete hai email wagera validate karne k liye

  
  // STEP-3 kaise check karenge that if user is already exists or nott so we import {User} frfom user.model.js 
  //so yeh User jo mongoose ki help se user.model.js k andar bana hai ye direct mongodb database se baat kar sakta hai
  ///jaise ye User aagaya toh humein kuch nhi karna hai ye User hii humare behalf pe call karega mongodb database ko jitni baar chaiye utni baart call kar sakta hai
  const existedUser = User.findOne({
    //muje check karna hai ki user ka ya toh email mil jaye ya to user ka username mil jaye ho sakta hai email alag ho but username already le rakha ho phir mein dunga
    //so we will use operators so $ sign use karke hum kaafi operators use kar sakte hai
    $or: [{ username },{ email }]
  })
  //so agar existedUser hai toh muje aage proceed hii nhi karna hai muje user ko sidha wahin k wahin error throw karna hai
  if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
  } 

  //STEPS4-- NOW Humein check karna hai images aur avatar wale images check karni padegi
  /*so abhi tak humne dekha hai ki server mein humare pass req.body k andar saara ka saara data aata hai
  but lekin kyunki humne "/register" k routes k andar jaakar -->upload middleware add kar diya hai toh
  yeh middleware bhi humein server ko kuch access deta hai toh yeh middleware karta kuch nhi hai ye
  frontend se aayi request k andar aur kuch fields add karta hai jyada tar cases mein yahi karta hai 
  toh jaise aapke pass req.body by default express ne de diya hai toh multer humein deta req.files ka access
  deta hai i.e multer humein req.files ka access de deta hai abb kyunki humare pass multiple files hai toh 
  files ka access humein issi tarah milta hai */
  const avatarLocalPath = req.files?.avatar[0]?.path; //kyunki humne file ko bola hii avatar hai isliye mein file ka naam avatar le rha hoon
  //console.log(avatarLocalPath) aise check bhi kar sakte hai 
  // avatarLocalPath isliye kyunki ye abhi humare server par hai ye abhi tak cloudinary par nhi gya hai

  //same with coverImage
  const coverImageLocalPath = req.files?.coverImage[0]?.path; //ie coverImage[0] ki first property se humein optionally ho sakta hai mil jaye ek path
  
  //toh humare pass server mein 2 LocalPath aagaye abb ye LocalPath honge ya nhi hone iski koi gurantee nhi hai ho bhi sakte hai nhi bhi ho sakte
  //but ek path to chaiye hii chaiye ki humare pass mein avatar wali image toh honi hii chaiye toh check karenge
  if(!avatarLocalPath) {
    throw new ApiError(400, "Avata file is required")
  }

//STEP 5- ABB ye dono file i.e avatarLocalPath and coverImageLocalPath jo humare server mein hai inko cloudinary mein upload karna hai
//i.e ye avatar file ko and coverImage ko cloudinary k upar upload karenge s
//so humare pass cloudinary par file upload karne k liye already configuration ho rakha hai in cloudinary.js file of utils
//i.e humne cloudinary.js utility file bana rakhi hai in utility folder 
//iss cloudinary.js file mein ek uploadOnCloudinary method hai  jiska use karke hum file ko cloudinary par upload karenge
//so uploadOnCloudinary(avatarLocalPath) pass kar dunga yeh avatar ko cloudinary k upar upload kar dega aur humein response mil jayega
//ye uploadOnCloudinary() ye method time lagayega file ko upload karne k liye isliye we will use await
 const avatar = await uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)

 //so ye avatar cloudinary par chala gya abb kyunki avatar required field hai agar nhi hoga toh database phatega
 //toh avatar ko ek baar phir check karenge
 if(!avatar){
   throw new ApiError(400, "Avatar file is required")
 }


  })

export {registerUser}