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

app.engine('ejs',ejsMate);
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}));


app.get('/student/:id',async(req,res)=>{
         const {id} = req.params;

        const student = await (await Student.findOne({admNo:`${id}`})).populate('book');
         
         res.render('student',{student});
     
})




















app.get('/addbook',async(req,res)=>{
           const newbook = new Book({
                 title:"Playing it my way",
                 author:"Sachin Tendulkar",
                 genre:"Philosophy",
                 yop:"2012"
           })

           await newbook.save();
           res.send(newbook);
})

app.get('/addstudent',async(req,res)=>{
           const newstudent = new Student({
                  name:"Srivardhan",
                  admNo:"21je0517",
                  phNo:"9392300190",
                  book:["64cea4b266ba76ecc63b6f1a","64cea50788b77a0543773dd2"]
           })
          await newstudent.save();
           res.send(newstudent);
})



app.get('*',(req,res)=>{
       res.send('Nothing Matches');
})


app.listen(3000,()=>{
    console.log('LISTENING AT PORT 3000')
})