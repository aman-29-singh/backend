/*so hum yahan par multer ka use karke middleware banayenge toh isko waise direct controller mein bhi
bana sakte but hum as a middleware hii isliye bana rahe hai because jahan jahan muje file upload ki 
capabilities ki jarurat padegi wahan wahan mein middleware ko inject kardunga jaise agar Registration form
mein jarurat padegi toh wahan inject kar dunga iss multer ko jaise Registration form mein jarurat padegi
toh Registration controllers aur /registration route k between bich mein hum iss multer ko as a middleware
use kar lenge aur login form mein jarurat nhi padegi toh login mein use nhi karenge yeh multer midddleware ko
 */
import multer from "multer";


//go to npm then multer then multer k github documentation se diskStorage ka code poora copy paste kiye
//here we use diskStorage ka code but bohat log memoryStorage ka code bhi copy karte hai i.e Buffer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    /*Noye ye jo file hota hai n ye file multer k pass hii hota hai so req toh hai hii aapke pass jo
    request i.e req user se aarahi hai toh multer se ek file access aapko mil jata hai jiske andar aapko
    saari files mil jati hai So req i.e request k andar toh body mein jo bhi aayega json data woh aapko
    mil hii jayega using req.body But agar file bhi aarahi hai request mein toh issi liye multer use hota hai
    because request.body k andar humne json data ye sab toh configure kar diya humne express mein but file nhi
    hoti hai isliye multer ya express-file-upload ye use hota hai taki humein bich mein ek aur option mil jaye
    file ka taki mein file ka use kar pau i.e file upload kar pau aur cb ka matlab callback hai */
    cb(null, "./public/temp")//ye path of destination hum apna denge toh sab files hum public folder k andar  rakenge
  },
  filename: function (req, file, cb) { // yeh file ka name configure karne k liye use hota hai
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)//isse jo user ne file ka orignal name rakha tha woh mil jayega
  }
})


export const upload = multer({ storage: storage })
/*Toh iss storage ko hum as a middleware use kar sakta hoon toh for example agar mein expect kar rha hoon
ki iss /registration par koi file as a request aayegi toh mein iss route k andar jaakar jaise upload.single()
documentation mein use hua hai waise hii mein mera storage middleware call karaunga aur bich mein storage likh 
dunga toh file mil jayega public/temp mein  */