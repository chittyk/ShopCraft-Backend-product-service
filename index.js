require('dotenv').config()
const express = require('express')
const connectDb = require('./src/config/db')
const app = require('./src/app')

const PORT = process.env.PORT
connectDb()


app.listen(PORT,()=>{
    console.log(`user-service is running at port http://localhost:${PORT}`)
})