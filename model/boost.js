
/*
 * Boost model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BoostSchema = new Schema( {
    stat:       String,     // CharStat by name
    bonus:      Number
});

var Boost = mongoose.model('Boost', BoostSchema);
module.exports = Boost;
