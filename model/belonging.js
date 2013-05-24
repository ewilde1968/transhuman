
/*
 * Belonging model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Item = require('./item');

var BelongingSchema = new Schema( {
    amount:     Number,
    damaged:    Boolean,
    carried:    Boolean,
    item:       Object    // Item
});

BelongingSchema.statics.create = function(itemObj) {
    var b = new Belonging({item:itemObj, amount:1, damaged:false, carried:false});
    return b;
};

var Belonging = mongoose.model('Belonging', BelongingSchema);
module.exports = Belonging;
