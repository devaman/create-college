const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const projectSchema  =  new Schema({


  date:{

  	type:Date,
  	required:true
  },
  college :{
    type:String,
  	ref:'college'
  },
  	user:{

		type:Schema.Types.ObjectId,
		ref:'user'

  },
  project:{
    type:Schema.Types.Mixed,
    required:true
  },
  createdOn:
  {
      type: Date,
  },
  ModifiedOn:
  {
      type: Date
  }



});
projectSchema.pre('save', async function (next){
  let a = await projects.find({user:this.user,project:this.project})
  if(a.length===0) next();
  else next(new Error("Already there in projects"))
})

projects =  mongoose.model('projects',projectSchema);
module.exports = projects;