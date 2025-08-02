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





export { app }