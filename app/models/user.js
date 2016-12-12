var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    index: {unique: true},
    lowercase: true,
    trim: true
  },
  lastLocation : {
    type: { 
      type: String,
      default: 'Point'
    }, 
    coordinates: [Number]
  },
  region:String,
  password: {
    type: String,
    select: false
  },
  profileImageURL: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'APCR', 'responsable']
  },
  gsm: String,

  isBlocked:{
    type: Boolean,
    default: false
  },


  accident : [
    {
      type : Schema.ObjectId,
      ref : 'Accident'
    }
  ],
  

  created: {
    type: Date,
    default: new Date()
  }
});


module.exports = mongoose.model('User', UserSchema);

