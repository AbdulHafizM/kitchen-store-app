require('dotenv').config()
const express = require('express')
const connectDB = require('./db/connect')


const app = express()



const port = process.env.PORT

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, ()=>{
            console.log('Ready to serve')
        })
    }catch(err){
        console.log(err)
    }
}

start()