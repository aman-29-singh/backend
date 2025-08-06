//api k Response ko bhi format kar denge
//tohjab bhi aap kisi ko Response bhejoge toh aap issi class k through hii bhejogey
//toh ye class jab bhi banegi toh status code lagega,data bhejna hoga user ko i.Response data send karega user ko
//aur kyunki Api Response hai toh message = Success send karenge user ko

class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode //OVERWRITE THE statusCode with Api k Response k data se
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}


export { ApiResponse }//doosre file mein use hone k liye