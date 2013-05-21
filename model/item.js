
/*
 * Item model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Techlevel = require('./techlevel');

var ItemSchema = new Schema( {
    name:       String,
    desc:       String,
    cost:       Number,
    sellPrice:  Number,
    dmgPrice:   Number,
    category:   String,
    techLevel:  [TechLevel],   // TechLevel
    benefits:   Array       // array of Benefit
});

var Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
