
/*
 * Benefit model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Boost = require('./boost');

var BenefitSchema = new Schema( {
    name:       String,
    desc:       String,
    boost:      [Boost],   // Boost
    inEffect:   Boolean,
    duration:   Number      // TODO: determine units
});

var Benefit = mongoose.model('Benefit', BenefitSchema);
module.exports = Benefit;
