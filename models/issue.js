const mongoose=require('mongoose')
const issueSchema=new mongoose.Schema({
   

   student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book",
        required:true
    },
    date:{
        type:Number,
        required:true
    }
   
})

module.exports=mongoose.model("Issue",issueSchema)