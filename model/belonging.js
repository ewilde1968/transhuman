
/*
 * Belonging model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BelongingSchema = new Schema( {
    amount:     Number,
    damaged:    Boolean,
    carried:    Boolean,
    item:       ObjectId    // Item
});

var Belonging = mongoose.model('Belonging', BelongingSchema);
module.exports = Belonging;
