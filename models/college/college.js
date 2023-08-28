const mongoose = require('mongoose');


const Schema  =mongoose.Schema; 

const college = new Schema({

	collegeDetails:{
		type:Schema.Types.Mixed

	},  //store any complex data structure to  schema like nesting info 
	fullName:{
		type:String,
		required:true
	},
	logo:{
		type:String,
		required:true
	},
	name:{
		type:String,
		unique:true,
		required:true
	}, 
	 blogEntries:
	[{
		type:Schema.Types.ObjectId,
		ref:'blogs'
  
	}],

	users:
	[
		{
			type:Schema.Types.ObjectId,
			ref:'user'
		}

	],

	event:
	[{
		type:Schema.Types.ObjectId,
			ref:'events'

	}],

	admins:
	[{
		type:Schema.Types.ObjectId,
		ref:'user'
	}],

	projects:[{

		type:Schema.Types.ObjectId,
		ref:'projects'
	}],
	createdOn:
    {
        type: Date,
    },
    ModifiedOn:
    {
        type: Date
    }




})

module.exports =  mongoose.model('college',college);