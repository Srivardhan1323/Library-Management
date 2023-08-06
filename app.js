const mongoose=require('mongoose')
const express=require('express')
const app=express()
const path = require('path');
const Book=require('./models/book')
const Student = require('./models/student')
const ejsMate = require('ejs-mate');



const dbURL='mongodb://127.0.0.1:27017/libraryManagement'
mongoose.connect(dbURL)
.then(()=>{
    console.log("MONGO CONNECTED!")
})
.catch(err=>{
    console.log(err)
})




app.listen(3000,()=>{
    console.log('LISTENING AT PORT 3000')
})