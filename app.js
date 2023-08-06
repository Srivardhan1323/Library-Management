const mongoose=require('mongoose')
const express=require('express')
const app=express()
const path = require('path');
const methodOverride = require('method-override');


const Book=require('./models/book')
const Student = require('./models/student')
const Issue = require('./models/issue');

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
app.use(methodOverride('_method'));

app.get('/student/:id',async(req,res)=>{
         const {id} = req.params;

        const student = await (await Student.findOne({admNo:`${id}`})).populate('book');
         
         res.render('student',{student});
     
})
app.get('/issue',async(req,res)=>{
    res.render('issue')   
})
app.post('/issue',async(req,res)=>{
    const {stuadmNo,booktitle}=req.body;
    const student=await (await Student.findOne({admNo:`${stuadmNo}`}));
    const book=await(await Book.findOne({title:`${booktitle}`}));
    await student.book.push(book)
    await student.save()
   
    const newIssue = new Issue({
        student : student,
        book    : book,
        returned : false
    })

    await newIssue.save();
    const id=student.admNo;
    res.redirect(`/student/${student.admNo}`);
})


app.get('/librarian',async(req,res)=>{
        const allStudents = await Student.find({}).populate('book');
        res.render('librarian',{allStudents});
})

app.delete('/librarian/:student/:book_id',async(req,res)=>{
  
      const {student,book_id} = req.params;
      const st = await Student.findOne({_id:student});
      const index = st.book.indexOf(book_id);
      st.book.splice(index, 1);
      await st.save();
      res.redirect('/librarian');
})
app.get('/addbook',async(req,res)=>{
    res.render('addbook');
})
app.post('/addbook',async(req,res)=>{
       const book=new Book(req.body);
       await book.save();
       res.redirect('/addbook');
})

app.get('/addstudent',async(req,res)=>{
           const newstudent = new Student({
                  name:"Srivardhan",
                  admNo:"21je0517",
                  phNo:"9392300190",
                  book:["64cf205ebc727f157022346f","64cf20ac61f2627690dd3311"]
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