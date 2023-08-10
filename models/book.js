const mongoose=require('mongoose')
const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        enum: ['Romance','Technology','Computer Science','Management','Electronics','Physics','Chemistry','Mathematics','Fiction','Philosophy','Language','Arts','Other'],
        required:true
    },
    yop:{
        type:Number,
        required:true
    },
    copies:{
        type:Number
    }
})
module.exports=mongoose.model('Book',bookSchema);
