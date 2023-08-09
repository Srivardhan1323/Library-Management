const mongoose=require('mongoose')
const studentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    admNo:{
        type:String,
        required:true
    },
    phNo:{
        type:String,
        required:true
    },
     
    email:{
         type:String,
         required:true
    },
    dep:{
        type:String,
        enum: ['Computer Science',
               'Electronics',
               'Mechanical',
               'Civil',
               'Mining',
               'Petoleum'],
        required:true
    },
    
    book:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Book',
        required:true
        }
   ]
})

module.exports=mongoose.model('Student',studentSchema)
