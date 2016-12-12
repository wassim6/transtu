var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ActivityLogSchema = new Schema({
    date:{
        type: Date,
        default: new Date()
    },
    device: String,
    type : {
        type: String,
        enum: ['logIn', 'logOut', 'editInfo']
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('ActivityLog', ActivityLogSchema);

