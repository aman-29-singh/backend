/*issmein humara simple sa goal hai ki file cloudinary k pass aayegi file system k through matlab hai ki
file humare server par already upload hogyi hai using multer.So so humare server par toh file aagyi hai
abb server se aap muje uss file ka localpath doge aur mein uss file ko cloudinary par daal dunga i.e cloudinary
par upload kar dunga now abb file ko humare server se remove bhin karna padega i.e agar successfully file upload
hogyi hai cloudinary par toh abb mere Server ko uss file ki jarurat hai nhi toh hum uss file ko i.e localpath k 
file ko Humare server se remove kar denge */
import {v2 as cloudinary} from "cloudinary"

/*toh Nodejs k andar ek fs i.e file system milta hai iss library ko install nhi karna padta hai ye Nodejs k
saath by default milta hai .so HUMARA jo file system hota hai n usmein file linked aur unlinked hoti hai
toh jab aap koi bhi file delete kar dete ho toh woh file fileSystem se UNLINKED HO JATI HAI 
so fs file system mein delete nhi milega unlinking milega */
import fs from "fs"


// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    /*toh hum thoda sa organized way mein karenge ki Ek method bana lete hai aur iss method mein aap i.e user
    muje server mein pade local path ka file as a parameter pass karega aur mein iss parameter se aaye humare
    server ka file ko cloudinary par upload kar dunga aur agar successfully upload hogya toh mein apne server
    se local path ka file delete kar dunga i.e unlink kar dunga file ko now ye file wala baat database jaisa
    complicated hota hai toh isliye hum try{} catch{} block use karta hoon aise complicated situation k liye  */

    const uploadOnCloudinary = async(localFilePath) => {
        try{
            if(!localFilePath) return null

            //upload the file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: auto //ye options milta hai Note- ye localFilePath ye file humari server par pade file se aarahi hai
            })
            //file has been uploaded successfully
            console.log("file is uploaded on cloudinary", response.url)//yeh response mein cloudinary se jo response aayega url woh hoga
            /*ye response humein cloudinary par image upload karne k baad cloudinary jo url banakar response bhejega 
            woh iss response mein hoga toh hum ye poora ka poora response jo cloudinary se aaya hai ye poora response
            hum user ko dedenge return response aise karke poora response user ko bhej denge toh user ko jo data chaiye 
            rahega woh le lega iss response mein se*/
            return response;

        } catch(error) {
            /*abb agar file successfully cloudinary par upload nhi hui hai toh humare pass ek case banta hai 
            catch ka aur agar localFilePath mein bhi kuch mistake hui hai toh bhi case banta hai catch ka
            lekin agar koi bhi iss method ko cloudinary k use karega toh itna muje pata hai ki user ka file 
            mere server par toh hai kyunki localFilePath mere pass aa chuka hai abb woh localFilePath ka file
            cloudinary par upload nhi hua hai toh problem toh hai toh humein kya karna chaiye for safe cleaning
            purpose usslocalFilePath k file ko apne server se hata dena chaiye hai warna bohat saari malicious file
            ya corrupted file hai woh reh jayegi server par toh issi k liye humne padha hai ki nodejs k
            fileSystem mein fs.unlink ka option hai toh hum yeh fs.unlink ka use bhi kar sakte hai aur ek
            fs.unlinkSync matlab asynchronous nhi ye hona hii chaiye kaam iske baad hii hum aage proceed karenge */
            
            fs.unlinkSync(localFilePath)// remove the locally saved temporary file as the upload operation got failed
            return null
        }
    }


export {uploadOnCloudinary}



/*
this is a code copy from cloudinary website for file upload in cloudinary



(async function() {

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    

    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();



*/