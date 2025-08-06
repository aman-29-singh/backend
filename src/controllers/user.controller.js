import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

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
})

export {registerUser}