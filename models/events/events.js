const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const eventSchema = new Schema({

  title:
  {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  organizer:
  {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },

  startDate: {

    type: Date,
    required: true
  },
  endDate: {

    type: Date,
    required: true
  },
  location: {

    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  college: {
    type: Schema.Types.ObjectID,
    ref: 'college'
  },
  registeredUsers: [{

    type: Schema.Types.ObjectId,
    ref: 'user'

  }]
  ,
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


});


module.exports = mongoose.model('events', eventSchema);