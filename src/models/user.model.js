import mongoose, { Schema } from "mongoose";
/*so userSchema k andar hum user ki history track kar rhe hai ki user ne kaun kaun si video dekhei hai
so history track karne k liye hum ek wtchHistory naam se ek object ka HUM ARRAY BANA RHE HAI KI aur
iss array k andar hum videos ki jitni bhi Id hai woh Ids hum iss array k andar push karte jayenge jaise 
ek video dekhogey toh uss watchHistory k array k andar hum uss particular video ka hum Id push kardenge
toh isse hum poori history track kar payenge toh models like user.model.js and video.models.js ye dono model
aapas mein coupled hai  */

import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
/**so ye dono aagaye abb password ko hash encrypt kaise karenge toh password ko direct encryption karna
 * possible nhi hai toh humein help leni padti hai mongoose ki kuch hooks ki i.e mongoose k documentation mein
 * jaise middleware par click karenge toh humein mil jayenge hooks toh unn hooks mein se ek hai pre hook
 * so pre hook ek middleware which executes one after another matlab jaise aapka data save hone jaa raha hoga
 * just usse pehle means agar kisi bhi user ne call function likha hai ya koi controller likha hai ki mera ye
 * wala data save kardo database mein toh database mein save hone se just pehle hum chahe toh iss (pre hook)
 * i.e PRE pre hook ko run karwa sakte hai i.e iss pre hook mein kuch bhi code insert karke hum execute karwa sakte 
 * hai ki mein nhi chahta ki data aise save hojaye mein chahta hoon data save hone se pehle hum kuch karde
 * i.e idhar hum password encrypt kar denge just before password ka data store ho usse pehle password k data
 * i.e password ko encrypt kar denge toh isker liye humare pass mein hooks hote hai  so jyada kar ke yeh pre hooks
 * humein iss model file mein hii use hote hai iss models files mein hii milenge proffesional code mein bhi
 */

const userSchema = new Schema(   //i.e direct kiye mongoose.Schema nhi kiye direct aise bhi kar sakte hai
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            /*so this property index of field username toh jitne bhi database hote hai specially Mongodb database
            mein toh kisi bhi field ko aapko Searchable banana hai jaise username field ko aapko Searchable banana
            hai optimized tarike se toh iska index:true kardo isse ye database ki Searching mein aane lagega
            toh agar aapko searching property kisi bhi field par enable karni hai toh hum index:true kar dete hai
            idhar field hai username Note- sab field mein index property nhi use karna hai bas jis field ko 
            search karenge ussi field mein index property use karenge*/
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //ye cloudinary ka url use karenge as a String
            required: true
        },
        coverImage: {
            type: String, //cloudinary url
        },
        watchHistory: [
            //ye watchHistoey field ye dependent hai videos model par 
            //toh watchHistory ye ek array hai kyunki multiple value ismein add karenge hum
            {
                type: Schema.Types.ObjectId,
                ref: "Video"//ye video.model.js mein declare karenge
            }
        ],
        password: {
            type: String,//database k andar jab bhi password rakho encrypt karke rakho i.e encrypted String
            required: [true, 'Password is required']//custom message ye true field par de sakte hai
        },
        refreshToken: {
            type: String
        }
    }, {
    timestamps: true
}
)///ye fields models jo provide kiye gye hai unko dekh kar banaya gya hai

//use of pre hook to encrypt the password data just before save in dattabase
/*toh ye hooks event par lagte hai jaise tha app.listen,app.onError toh ye pre hook bhi kuch ussi tarah k 
hooks hote hai toh kaun se event aap use karna chahte ho toh idhar "SAVE" Event par lagayenge ye hooks
aur bhi events hote hai jaise middleware par jayenge mongoose k toh aur bhi events milenge jaise validate,
save,rfemove,updateOne,deleteOne etc jo bhi aapke pass functinality hai toh mere pass functinality hai
ki jab bhi data save ho rha ho usse pehle muje kuch kaam karana hai i.e password save hone se pehle muje password
ko encrypt karana hai using "pre" hook so Note - save Event chal rha hai iss userSchema par */
userSchema.pre("save", async function (next) {
    /*so muje karna hai ki jab bhi mera password ya poora ye userSchema ka field save ho rha ho database mei 
    toh userSchema k field mein se password field ko loo aur encrypt karke save kardo database mein*/
    // this.password  //kyunki humne pre hook use kiya hai toh this ko context userSchema k saare field ka access hai
    //   this.password = bcrypt.hash(this.password, 10)//10 is salt rounds and this.password ko encrypt karna hai
    //   next()
    /*hum kuch aisa karna hai ki jab password field mein aapko bhejo i.e password field ka modification jab
    bhejutabhi iss code ko aapko run karna hai agar uss field mein koi password mein modification nhi hai
    toh iss function ko run mat karo i.e har baar password ko encrypt mat karo jab password field bheju tabhi
    encrypt karna haiaur password field kab kab bhejunga toh password field first time bhejunga jab password 
    save kara rha hoon ya phir agar mein password update karna chahu ya new password set karna chahu tab
    password bhejunga tab encrypt karna so we will use if{} condition to check if field is modigy or not */
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)// so password encrypt kar dega
    next()
})
/*now humein kuch methods create karne padenge taki jab hum user ko import karaye toh user se puch le 
ki password sahi hai ya nhi hai because humne jo password dataabaase mein store karaya woh encrypted hai
 lekin jo bahar humein user bhejega woh pasword 1,2,3,4,5 aise bhejega i.e jo bhi user ka password hai woh bhejega
 toh hum kuch iss tarah se methods banayenge jaise Middleware bana sakte hai waise mongoose hum option deta 
 hai ki hum iske andar methods inject kar sakte hai jaise kuch methods hum direct milte hai mongoose se jaise updateOne
 deleteOne etc ye methods humein mongoose se milte hai toh issi tarah ke hum custom methods bhi design kar sakte hai
 toh custom methods design karne k liye bhi humein userSchema lena padta hai toh userSchema.methods.JO BHI METHOD
 I.E userSchema ka andar ek object hota hai jiska naam hai methods aur iss methods k andar aap jitne chahe method
 aap add kardo i.e userSchema.methods.method */
userSchema.methods.isPasswordCorrect = async function (password) {
    //bcrypt library ye password encrypt hash karti hai toh ye password aapki check bhi kar sakti hai
    return await bcrypt.compare(password, this.password) //ye return true karega agar password match karega
    /*idhar bcrypt.compare() k andar ye jo password hai ye user ne login karne k liye jo apna password hai woh 
    wala password hai in sttring mein i.e user encrypted mein password nhi bhejega and this.password yeh bcrypt
    ne jo encrypt karke password ko database mein store kiya tha woh wala password hai jab user first time 
    sign Up i.e Register kiya tha tab bcrypt ki help se password ko encrypt karke database mein store kiye the  */
}


/*Note -- jwt is a bearer token hai toh abb bearer token se matlab hai ki jo uss token ko bear karta hai
woh usse hii maan lete hai matlab ye token jiske bhi pass hai jo bhi muje ye token bhejega mein usse data bhej
dunga i.e chabi ki tarah hai ye token data access karne k liye So library jo hum use karte hai jwt token
ye library jwt humein tokens bana kar de deti hai  */

/*Note-- jo access token hoga humare pass woh hum databaase mein stor nhi karenge but jo Refresh_Token hai
isko hum database mein store karenge toh yahan par sessions aurf cookies dono hii hum use kar rhe hai
kafi security k saath hum jaa rhe hai */

/* toh humne pre bhi sikh liya and method bhi sikh liya toh kya iss tarah se mein access_token generate
karne ka bhi method use karf sakta honn toh Haa exactly ye tarika humein jitne chahe utne methods hum
apne Schema mein inject kar sakte hai  */
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(//TOH isse token banaya hai token banane k liye 3 chiz chaiye hota hai payload,Secret_key,expiresIn
        {
            //YEH PAYLOAD HAI TOKEN KA
            /*ye jo method hai n jwt.sign() ye already humsri database mein chize+ save hai aur inke pass
            i.e this k pass unn sab ka access hai this k pass isliye function{} likhte hai aur arrow
            function nhi likhte because arrow function mein (this) use nhi hota */
            _id: this._id,
            email: this.email,//this.email ye database se aarha hai aur ye key email ye payload ka naam hai key hai
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,//Secret_key hai token ka
        {
            //expiry ye object k andar jata hai
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {//Refresh_token ye same Access_Token ki tarah banta hai
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)    