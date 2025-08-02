class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong", //agar koi error message nhi dega toh ye message aayega
        errors = [],
        statck = ""
    ){
        //abb idhar constructor k parameters ko hum Overwrite karenge idhar
        super(message)//super() call karenge message ko OverWrite karne k liye
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false //toh idhar false isliye because api k success ko hum handle nhi kar rhe hai
        //i.e idhar hum api k failure ko hum handle i.e format kar rhe hai isliye api k success ko nhi
        //isliye this.success = false
        this.errors = errors


        if (statck) {
            //api error ki file woh issi statck mein hota hai ye production mein karte hai
            this.stack = statck
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export { ApiError }