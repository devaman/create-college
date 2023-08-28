const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const BlogSchema = new Schema({

    title:
    {
        type:String,
        required:true

    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    body:
    {

        type:String,
        required:true

    },

    college:{

        type:Schema.Types.ObjectId ,
        ref:'college'
    },

    author:
    {
        type:Schema.Types.ObjectId, 
        ref:'user'
    },

    timeStamp:
    {
            type:Date
           
    },
    createdOn:
    {
        type: Date,
    },
    ModifiedOn:
    {
        type: Date
    },
    category:{
        type:String,
        enum:['private','featured','shared'],
        default:'private'
    }




})


module.exports = mongoose.model('blogs',BlogSchema);