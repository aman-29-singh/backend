import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

//ye method separately bana rahe hai because ye method bohat jaghah use hoga jab tokens banana hoga
const generateAccessAndRefreshTokens = async(userId) => {
  try{
     const user = await User.findById(userId)
     const accessToken = user.generateAccessToken()
     const refreshToken = user.generateRefreshToken()
     /**AccessToken toh server ye user client ko de deta hai  lekin RefreshToken ko server apne database mein bhi save 
      * karke rakhta hai taki baar baar user se password na maangna pade user se toh abb RefreshToken ko database mein 
      * kaise stor karein toh ye user jo hai ye object hai iske andar user client ki saari property hai toh jab user ki saari
      * property aayi hai jaise user ka username aaya hai, password aaya hai,watchHistory aaya hai ussi tarah se
      * refreshToken bhi aaya hai hai tto abb object k andar kaise value add karenge  so
      */
     user.refreshToken = refreshToken //toh user k andar humne refreshToken add kara diya but user ko save nhi karaya hai
     //toh user ko save karayenge
      await user.save({validateBeforeSave: false})//kyunki mongodb se banakar aaya hai toh humare pass save method hota hai
     //validateBefore:false means validatte karne ki jarurat nhi hai yahaan refreshToken database mein store hogya
    

     /**so user client ka refreshToken and AccessToken dono abhi server k pass hai aur refreshToken ko database
      * mein jaakaar store karwa chuka hoon lekin refreshToken ka reference abhi server mein hai huamre pass
      * i.e above mein rakha hai reference i.e const refreshToken = user.generateRefreshToken()
      * toh abb server kya karega ki accessToken and RefreshToken ko return kar dega yahan se
      * toh abb ye method generateAccessAndRefreshToken(userId) ko jab bhi hum run karenge userId pass
      * karke toh ye method apne aap hii user ko find kar lega userId k basis par aur uske baad AccessToken aur
      * RefreshToken bhi generate kar lega aur uske baad ye user k refreshToken ko database mein save bhi kara diya
      * aur fir last mein accessToken and refreshTToken ko return kar dega 
      */
     return {accessToken, refreshToken}
    } catch(error){
    throw new ApiError(500, "Something went wrong while generating refresh And Access token")
  }
}

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
  const existedUser = await User.findOne({ // await lagana hai
    //muje check karna hai ki user ka ya toh email mil jaye ya to user ka username mil jaye ho sakta hai email alag ho but username already le rakha ho phir mein dunga
    //so we will use operators so $ sign use karke hum kaafi operators use kar sakte hai
    $or: [{ username },{ email }]
  })
  //so agar existedUser hai toh muje aage proceed hii nhi karna hai muje user ko sidha wahin k wahin error throw karna hai
  if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
  }
  console.log(req.files); 

  //STEPS4-- NOW Humein check karna hai images aur avatar wale images check karni padegi
  /*so abhi tak humne dekha hai ki server mein humare pass req.body k andar saara ka saara data aata hai
  but lekin kyunki humne "/register" k routes k andar jaakar -->upload middleware add kar diya hai toh
  yeh middleware bhi humein server ko kuch access deta hai toh yeh middleware karta kuch nhi hai ye
  frontend se aayi request k andar aur kuch fields add karta hai jyada tar cases mein yahi karta hai 
  toh jaise aapke pass req.body by default express ne de diya hai toh multer humein deta req.files ka access
  deta hai i.e multer humein req.files ka access de deta hai abb kyunki humare pass multiple files hai toh 
  files ka access humein issi tarah milta hai */
  //const avatarLocalPath = req.files?.avatar[0]?.path; //kyunki humne file ko bola hii avatar hai isliye mein file ka naam avatar le rha hoon
   const avatarLocalPath = req.files?.avatar[0]?.path;
  //console.log(avatarLocalPath) aise check bhi kar sakte hai 
  // avatarLocalPath isliye kyunki ye abhi humare server par hai ye abhi tak cloudinary par nhi gya hai

  //same with coverImage advance tarika coverImageLocalPath  check karne ka i.e advance if else use karne
  //const coverImageLocalPath = req.files?.coverImage[0]?.path; //ie coverImage[0] ki first property se humein optionally ho sakta hai mil jaye ek path
  
  let coverImageLocalPath;
  //so classic tarika check karne ka ki coverImageLocalPath
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = reqfiles.coverImage[0].path //isse coverImage="" aayega agar empty hoga toh but advance if else se error aata
  }
  //console.log(avatarLocalPath, "ye error hai")
  //toh humare pass server mein 2 LocalPath aagaye abb ye LocalPath honge ya nhi hone iski koi gurantee nhi hai ho bhi sakte hai nhi bhi ho sakte
  //but ek path to chaiye hii chaiye ki humare pass mein avatar wali image toh honi hii chaiye toh check karenge
  if(!avatarLocalPath) { //ie avatar agar server k localPath par nhi mila toh throw the error
    throw new ApiError(400, "Avatar file is required")
  }

//STEP 5- ABB ye dono file i.e avatarLocalPath and coverImageLocalPath jo humare server mein hai inko cloudinary mein upload karna hai
//i.e ye avatar file ko and coverImage ko cloudinary k upar upload karenge s
//so humare pass cloudinary par file upload karne k liye already configuration ho rakha hai in cloudinary.js file of utils
//i.e humne cloudinary.js utility file bana rakhi hai in utility folder 
//iss cloudinary.js file mein ek uploadOnCloudinary method hai  jiska use karke hum file ko cloudinary par upload karenge
//so uploadOnCloudinary(avatarLocalPath) pass kar dunga yeh avatar ko cloudinary k upar upload kar dega aur humein response mil jayega
//ye uploadOnCloudinary() ye method time lagayega file ko upload karne k liye isliye we will use await
 const avatar = await uploadOnCloudinary(avatarLocalPath)//avatar agar avatarLocalPath mein mil gya toh cloudinary par upload kardo
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)//agar coverImageLocalPath nhi mila toh clodinary humein error nhi de rha bas ""empty string rturn kar deta hai

 //so ye avatar cloudinary par chala gya abb kyunki avatar required field hai agar nhi hoga toh database phatega
 //toh avatar ko ek baar phir check karenge
 if(!avatar){
   throw new ApiError(400, "Avatar file is required")
 }


 //STEP 6- Abb agar saara kaam thik se hogya hai avatar ye sab ka url aagaya hai toh ek object banao aur database mein entry maar do
 ////toh abb bas object banakar database mein entry kardo toh abb database mein entry kaise hoga
 //toh humare pass ek hii chiz hai jo Database se baat kar rha hai ye User hai yahi database se baat kar rha hai
  const user = await User.create({// idhar const user karo User nahi database mein User create hone mein time lagega isliye hum use karenge await ko
  fullName,
  avatar: avatar.url,//so cloudinary humein poora response bhejega but humein response mein se sirf url ko database mein store karenge
  //so agar avatar:avatar karte toh poora object database mein store ho jata but humein sirf url ko hii store karna tha
  coverImage:coverImage?.url || "",//agar coverImage hai toh usmein se url nikal lo agar coverImage nhi hai toh empty rehne do usko i.e "" because coverImage required field nhi hai user.model.js k andar
  email,
  password,
  username:username.toLowerCase()
  //so abb ek proper object ban gya hai jismein jitne fields muje chaiye woh ban gye hai i.e jitne fields user.model.js mein define hai woh ban gye hai
  //watchHistory and refreshToken ko hum programitically baad mein add karenge abhi jo required:true field hai woh humne add kiya hai
  
})


//agar ye User successfully create hua hai n toh sirf humne jo data diya hai yahi sab data create nhi hota
// iske saath mongodb apne aap har ek entry k saath ek _id naam ka field add kar deta hai user._id mil gya toh matlab user aapka create
//so yeh _id yeh ek extra field apne aap add hota hai
const createdUser = await User.findById(user._id).select( //THIS IS STEP 7 i.e remove the password and refreshToken field from response
  //ismein hum woh field likhte hai jo nhi chaiye because we want to remove password  and refreshToken
  //toh by default saare selected hote hai toh "-" negative minus jis field k aage matlab woh nahi chaiye
  "-password -refreshToken"
  //so abb mere pass saara response aaya hai createdUser ka create hokar but ismein 2 field select hokar nahi aayenge i.e password and refreshToken

) 
 
 //STEP 8 --abb check karenge user creation
 if(!createdUser) {//abb agar user nhi create hua toh error dedo
  throw new ApiError(500, "Something went wrong while registering a user")
 }

 //STEP 9 ABB agar user propery ban gya hai toh abb response mein bhej do sabko wapis i.e return response
 //so humein response k liye help lagegi utility folder k ApiResponse ki because hum nhi chahte ki response kaise bhi jaye
 //hum chahte hai ki Response properly structured organized Response jaye har baar toh iske liye ApiResponse lagega
 //toh mein chahta hoon ki ye createdUser hai isko poore ko hii hum data k saath because in ApiRespone mein this.data aise allowed hai data ko bhejna

 return res.status(201).json(
  new ApiResponse(200, createdUser, "User registered Successfully")
  //here createdUser is data yahi data ApiResponse mein jaakar this.data banta hai
 )

  })





 
  /*Note concecpt eh hai inn dono tokens k bich mein i.e refresh token and access token k bich mein
ki jab tak aapke pass i.e user k pass Access Token hai tab tak aap koi aap  bhi fetaure jaha par 
aapki i.e client ki authentication ki requirement hai waha par aap access kar saktee ho uss resource ko
suppose karo har kisi ko file Upload toh nhi karne diya jaa sakta server par toh agar aap i.e user autthenticated
ho login ho toh toh aap kar loge lekin agar maan lijiye ki aapka i.e user ka login session maine 15 minutte k 
andar hii maine i.e server ne expire kar diya for security reasons ki wajah se toh phir user ko 15 minute k baad
password insert karna padega  aur user ko phirse login karna padega yahin par exact point par humaara aata 
hai refresh Token ab  ye Refresh Token kya hai hum database mein bhi store rakhte hai aur User ko bhi refresh Token dette hai
toh server ye User ko validate toh access Token se hii karta hai lekin server ye User ko bol deta hai ki har baar User
ko password daalne ki ki jarurat nhi hai agar User k pass User ka Refresh Token hai toh ek endPoint hit kardo
wahan se agar User k pass jo Refresh TToken hai aur server k pass jo database mein sttore kiya hua Refresh Token hai
ye dono Refresh Token agar same hogye n toh server and User ye dono mandwali kar lenge i.e aapas mein baat kar lenge
aur server ye User ko ek new Access Token de dega so here Acess Token ye short lived hai and Refresh Token ye long lived hai      */

/**so abb hum ye dono methods ko use karenge i.e Access Token and Refresh Token ko aur isko use karke hum login
 * User banayenge
 */
const loginUser = asyncHandler(async (req, res) => {
    //steps ki hum /login ka controller kaise banayenge
    //Step1-> req.body se user ka data leke aao
    //STEP-2-> check Username,email etc wagera correct hai ya nhi i.e validatae hai ya nhi i.e kahin user ne emptty value toh nhi send kar diya
    /*YAHAN par server k upar hai ki server ye username based access dena chahte ho user ko ya email based access dena chahte ho
    i.e username or email dono mein se ek pe aap user ko login karwa sakte ho but hum code aisa likhenge ki ek hii 
    code dono par kaam karega matlab agaar koi email based bana raaha hai toh uspe bhi kaam kar jaye aur agar koi username 
    based login bana rha hai toh uspe bhi kaam kar jaye */
    /*STEP-3-> find the user ki User humare pass database mein hai ya nhi so agar user nhi hai database mein toh obvious si baat hai
    mein i.e server bol dega user ki request ko ki user hai hii nhi yahan par agar user mil jata hai database mein toh kya karna 
    padega toh login hai toh user ka password check karwao toh agar password check nhi hua ttoh server user ko bo dega
    ki password aapka wrong hai so */
    //STEP-4-> PASSWORD CHECK
    /*STEP-5-> Access Token  and Refreh Token so agar User ka paswword check means correct hogya toh server ko 
    Access and Refresh Token dono generate karne padenge aur hii dono User ko bhejenge
    so jab humne models design kiye the upar above mein toh humne iss tarah  se kar liya tha ki ye jo
    AccessToken hai ye toh generate ho jata hai easily aur humein User i.e client ko mil jata hai jwtt.sign aur RefreshToken ye bhi 
    client k pass Generate ho jata hai to 
    so User k pass ACCESS tOKEN BHI gENERATE HOGYA AND Refresh Token bhi generate hogya so   */
    /*STEP-6 -> iske baad inn Tokens ko bhej doo user ko Cookies mein send kardo toh hum secure Cookies 
    bhejte hai aur User ko Response bhej do ek ki successfully login hogya hai so 
     HERE yahan par STEP-6 is all about send Cookies */

    //STEP-1
    const { email, username, password } = req.body

    if (!username || !email) { //agar user k pass username or email dono nhi hai toh error send karo
        throw new ApiError(400, "username or password is required")
        //agar sirf email se hii login karwana tha toh hum if(!email) karke check karte
    }

    /*so agar aap user already Registered ho toh user login kar sakta hai toh matlab ya toh username ka koi hoga mere pass database mein
    ya toh email ka hoga toh dono ko kaise find kar sakte   */
    const user = await User.findOne({
        //toh server find karna chahta hai ki ya toh email find kardo ya phir username find kardo toh hum $ sin use kar sakte hai
        //$or,$and etc ye mongodb k operators hai
        $or: [{ username }, { email }]//Toh abB ye $or operator find karegaa ek value ko ya toh woh username k basis par mil jaye ya woh email k base par mil jaye

    })
    //toh agar ye $or laga k inn dono k basis par i.e username or email $or laga kar bhi User nhi m,ila means woh User kabhi Registered tha hii nhi
    //STEP-3 CHECK USERS IN DATABASE
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    //Steps-4 agar user mil gya toh password check karna padega so password kaise check karenge
    //so above humare pass method ban sakte hai isPasswordCorrect() kaise bcrypt humein help kar sakta hai password check karne k liye
    //but iss bcrypt ko humein dena padega ek password dena padega aur ek current User k andar se bhi password dena padega
    //i.e bcrypt.compare(password, this.password) idhar ye password hai jo hum denge aur this.password hai current user k andar ka password
    //so humein jo issPassword = async function(password) jo ye wala password hai ye user wala password hai jo user client side pass karega
    //aur jo this.password hai ye saved user ka password hai jo database mein save user hai uss database ka andar k user ka password hai
     const isPasswordValid = await user.isPasswordCorrect(password)//ye user humara user hai ye mongoose ka User nhi hai toh iss user k pass humara define kiya hua methods hai
     //so so ye wala humara user i.e client ka hai jo humne database se wapas liya hai toh iske pass humara wala methods hoga
     // ispasswordCorrect(password) ye humne req.body se nikala hai password jo user ne client side se bheja hai
     //abb agar isPasswordCorrect thik hai toh obvious si baat hai aage chaliye aur agar password thik nhi toh error dena padega
     if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials ")
    }//toh abb user ka password bhi check hogya hai

    //step-5 toh agar user ka password bhi thik hai toh Access Token and Refresh Token banao
    //abb ye Access and Refresh Token wala kaam hum kahin baar karenge in fact ye kaam itna common hai ki ho saktta hai kahin baar iska use aayega
    //so kahin baar Ye Access Token and Refresh token ka use aayega isliye method above banayenge
    //SO METHOD ABOVE UPAR BANAYAENGE i.e const generateAccessAndRefreshTokens= async(userId) toh iss user humare user k through userId le sakte hai
    



    })

export {registerUser,loginUser}