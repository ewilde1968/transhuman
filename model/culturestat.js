
/*
 * CultureStat model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CultureStatSchema = new Schema( {
    name:       String,
    desc:       String,
    level:      Number
});

var CultureStat = mongoose.model('CultureStat', CultureStatSchema);
module.exports = CultureStat;
