const mongoose = require("mongoose")

const connectDb = ()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("product db connnected successfuly")
    })
    .catch((error)=>{
        console.log("product db is not connected due  to ",error)
    })
}
module.exports = connectDb