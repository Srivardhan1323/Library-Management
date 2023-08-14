const mongoose=require('mongoose')
const express=require('express')
const app=express()
const path = require('path');
const methodOverride = require('method-override');
const bcrypt=require('bcrypt');
const session=require('express-session');

const Book=require('./models/book')
const Student = require('./models/student')
const Issue = require('./models/issue')
const Admin=require('./models/admin')
const User=require('./models/user')

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
app.use(session({secret:" "}));


app.get('/signin',(req,res)=>{
    if(req.session.user_id) 
    {
        return res.redirect('student/profile');
    }

    res.render('signin');
})
app.post('/signin',async(req,res)=>{
    const {username,password}=req.body;
    const user=  await User.findOne({ username });
    if(user==null)
    {
        return res.send('<script>alert("Incorrect Username Or Password"); window.location="/signin";</script>');
        return res.render('signin');
    }
    const validpassword= await bcrypt.compare(password,user.password);
    if(validpassword)
    {
            req.session.user_id= user._id;
            req.session.username=user.username;
            res.redirect(`student/profile/${user.username}`);
    }
    else{
         return res.send('<script>alert("Incorrect Username Or Password"); window.location="/signin";</script>')
         res.render('signin');
    }
})
app.get('/admin',async (req,res)=>{
    res.render('admin');
})
app.post('/admin',async (req,res)=>{
    const {adminname,password}=req.body;    
    const admin=  await Admin.findOne({ adminname });
    if(admin==null)
    {
        
        return res.send('<script>alert("Incorrect Adminname Or Password"); window.location="/signin";</script>');
        return res.render('admin');
    }

    const validpassword= await bcrypt.compare(password,admin.password);
    console.log(validpassword)
    if(validpassword)
    {
            req.session.admin_id= admin._id;
            req.session.adminname=admin.adminname;
            res.redirect('/allbooks');
    }
    else{
         return res.send('<script>alert("Incorrect Username Or Password"); window.location="/signin";</script>')
         res.render('admin');
    }
})
// app.get('/addadmin',async(req,res)=>{
    
//     const hash =await bcrypt.hash("1234",12);
//     const newadmin=new Admin({
//         adminname:"ISM-LIB",
//         password:hash
//     })
//     await newadmin.save();
//     res.send(newadmin);
// })



app.get('/allbooks',async(req,res)=>{
        const allbooks = await Book.find({});
        res.render('allbooks',{allbooks});
})


app.get('/student/profile/:id',async(req,res)=>{
         const {id} = req.params;

        const student = await (await Student.findOne({admNo:`${id}`})).populate('book');
         
         res.render('student/profile',{student});
     
})

app.get('/student/profile/:id/books', async(req,res)=>{
    const {id} = req.params;

    const student = await (await Student.findOne({admNo:`${id}`})).populate('book');
     
     res.render('student/showBooks',{student});
})
app.get('/librarian/issue/:title',async(req,res)=>{
    const {title} = req.params;
    res.render('librarian/issue',{title});   
})
app.post('/librarian/issue',async(req,res)=>{
    const {stuadmNo,booktitle}=req.body;
    const student=await (await Student.findOne({admNo:`${stuadmNo}`}));
    const book=await(await Book.findOne({title:`${booktitle}`}));
    await student.book.push(book)
    book.copies--;
    await book.save()
    await student.save()
   
    const newIssue = new Issue({
        student : student,
        book    : book,
        returned : false
    })
    await newIssue.save();
    const id=student.admNo;
    //res.send(book);
    res.redirect(`/student/profile/${student.admNo}/books`);
})


app.get('/librarian/return',async(req,res)=>{
        const allStudents = await Student.find({}).populate('book');

        res.render('librarian/return',{allStudents});
})

app.delete('/librarian/return/:student/:book_id',async(req,res)=>{
      const {student,book_id} = req.params;
      const st = await Student.findOne({_id:student});
      const book=await Book.findOne({_id:book_id});
      const index = st.book.indexOf(book_id);
      st.book.splice(index, 1);
      book.copies++;
      await book.save();
      await st.save();
      res.redirect('/librarian/return');
})
app.get('/librarian/addbook',async(req,res)=>{
    
    res.render('librarian/addbook');
})
app.post('/librarian/addbook',async(req,res)=>{
       const book=new Book(req.body);
       await book.save();
       res.redirect('librarian/addbook');
})
app.get('/librarian/addnewuser',async(req,res)=>{
    res.render('librarian/addnewuser')
})
app.post('/librarian/addnewuser',async(req,res)=>{
           const student=req.body;
           const newstudent = new Student({
                  name:student.name,
                  admNo:student.admNo,
                  phNo:student.phNo,
                  email:student.email,
                  dep:student.dep,
                  book:[],
           })
          await newstudent.save();
          console.log(newstudent);
          const hash =await bcrypt.hash("1234",12);
          const newuser=new User({
            username:student.admNo,
            password:hash
          })
          await newuser.save();
          res.render('librarian/addnewuser');
})


app.get('/allbooks',async(req,res)=>{
    const allbooks=await Book.find({});
    res.render('allbooks',{allbooks});
})



app.get('*',(req,res)=>{
       res.send('Nothing Matches');
})


app.listen(3000,()=>{
    console.log('LISTENING AT PORT 3000')
})