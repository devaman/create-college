const mongoose = require('mongoose');
const Schema  = mongoose.Schema;


const userSchema  = new Schema({

  isAdmin:
  {

      type: Number, 
      
      enum : [0,1,2], 
      
      default: 2
         
  },
  userId:{

      required:true,
      type:String
    },
    username:{

      required:true,
      type:String
    },
    email:{

      required:true,
      unique:true,
      type:String
    },
    gitUrl:{
       
       requried:true,
       type:String

    },
followers:{
    type:String
},
following:{
    type:String
},
college:{


  type:String,
  ref:'college'

},
avtarUrl:{
     type:String ,
     required:true
},  
events:
  [{
    type:Schema.Types.ObjectId,
    ref:'events'

  }],
  access_token:{
    type:String,
    required:true
  },

  blogEntries:
  [{
      type:Schema.Types.ObjectId,
      ref:'blogs'

  }],
  projects:[{

		type:Schema.Types.ObjectId,
		ref:'projects'
	}]


})
module.exports = mongoose.model('user',userSchema);