import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN , //MEANS KAUN KAUN SE ORIGIN k request aap apne backend mein allow karenge
    credentials : true
}))

/*now data kahin jagah se aayega backend mein toh uski preparation karni padegi i.e url se data aayega, kuch log
json mein data bhejenge directly kuch log request body mein bhejenge ,toh kuch ka direct form mein data
aayega kuch ka json mein form aayega toh iske liye kuch setting lagega jaise json mein data bhejne ka matlab ye 
thodi hai ki humara server unlimitted json ka data as a request accept karega toh humara server crash ho jayega
isliye hum kuch limit lagate hai ki itna json ka data hii server accept karega as a request */

app.use(express.json({limit: "16kb"})) //aise json ko configure karenge iss middleware se humara backend json data accept kar sakta hai

//now humein ek aur configuration karni hai ki jab backend mein urk se data aaye toh backend kaise samje
app.use(express.urlencoded({extended: true, limit:"16kb"}))//yeh url k request k liye hota hai

app.use(express.static("public"))//ye configuration hai humare public folder k assets k liye jise favicon,images etc hongi


/*now yeh cookieParser ka use karke k hum humare server se user(client) ka jo browser hai n toh user k browser k
andar ki cookies ko access kar pau  aur user k browser k andar cookies set bhi kar pau toh user k  browser k cookies
mein CRUD Operation basically perform kar pau kyunki kuch tarike  hote hai jisse aap secure cookies user k browser
mein rakh sakte ho aur unn secure cookies ko sirf server hii Read kar sakta hai aur server hii uss cookies ko
Remove kar sakta hai */
app.use(cookieParser())//cookieParser() iss () k andar bhi options hai jo kaam aane par use karenge


//routtes import from user.route.js i.e routes folder se
import router from "./routes/user.route.js";

/*routes declaration so app.get() pehle likh rahe the aur apna kaam ho rha tha aur ye kaam isliye ho rha
tha kyunki app.get() k through hum yahin par routes likh rahe the aur yahin par hum controllers likh rahe the i.e app.get() k andar
par kyunki abb chize separate hogyi hai i.e router ko hum alag nikalkar routes folder mein le gye hai
toh abb router ko laana k liye middleware lana padega i.e app.get() ki jagah hum app.use() ko use karenge i.e middleware app.use() ko use karenge*/
app.use("/api/v1/users", router)//toh koi bhi user jaise type karega /users toh hum control dedenge router of routes folder k
//toh router ye jayega user.route.js file mein aur iss file mein router par route like /register and iska controller define hoga like registerUser
//so url banega http://localhost:8000/users/register so ye /register user.route.js mein se aayega aur bhi routes jaise /login,/dashboard etc aasakte hai using router
//toh phir /login,/dashboard par jane k liye bas url mein thoda change jaise http:localhost:8000/users/login aise hoga
//ye toh samaj aagaya /users but standard practice hoti hai ki agar hum apni api define kar rhe hai toh bataiye ki aap api define kar rahe hai
//aur api ki versioning kya  chal rha hai ye sab batana padta hai toh hum app.use("/api/v1/users", router) so idhar api means
//hum apni api define kar rhe hai v1 means version 1 and /users matlab user.route ko indicate kar rha hai so yeh
//so yeh ek achi practice hoti hai sttandardize practice hoti hai

//so url banega http://localhost:8000/api/v1/users/register 

/*so jab application humari run ho toh kya hoga ki mein jaunga /api/v1/users pe aur yahan par janeke baad router app.use()
ka activate ho jayega router phir ye router k throuhg hum routes folder k user.routes.js file k andar aajayenge phir iske andar aaane k baad
muje pata hai ki agar hum /register lagayenge toh registerUser method controller call ho jayega phir hum jayenge 
controller folder k user.controller.js file k andar aur ye method i.e controller method registerUser execute hoga
 */


export { app }