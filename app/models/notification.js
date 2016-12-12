var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var NotificationSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  isRead:{type:Boolean, default: false },
  accident:{
    type: Schema.ObjectId,
    ref: 'Accident'
  },
  date:{
    type: Date,
    default: new Date()
  }
});


module.exports = mongoose.model('Nofification', NotificationSchema);

