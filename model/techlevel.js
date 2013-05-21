
/*
 * TechLevel model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TechLevelSchema = new Schema( {
    biology:    Number,
    computer:   Number,
    nano:       Number
});

var TechLevel = mongoose.model('TechLevel', TechLevelSchema);
module.exports = TechLevel;
