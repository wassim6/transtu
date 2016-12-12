var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccidentSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  roadType:String,
  busType:String,
  date:{type:Date},
  location : {
    type: { 
      type: String,
      default: 'Point'
    }, 
    coordinates: [Number]
  },
  adress: {
    city:String,
    district:String,
    placeId: String,
    state: String,
    street:String,
    name: String,
  },
  ligne: String,
  accident_type: String,
  degats_physiques: Number,
  degats_corporels: Boolean,
  injuriesNumber:Number,
  deathsNumber:Number,

  district:String,
  numeroBus:String,
  numeroPv:String,
  posteGardePolice:String,
  observation:String,
  
  created: {
    type: Date,
    default: new Date()
  },
});

module.exports = mongoose.model('Accident', AccidentSchema);
