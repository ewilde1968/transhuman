
/*
 * Homeland model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CharStatSchema = new Schema( {
    name:       String,
    desc:       String,
    currentLvl: Number,
    maxLevel:   Number
});

CharStatSchema.descriptions = {
    Soma: 'Everything body.',
    Nous: 'Everything mind.'
};

CharStatSchema.statics.getDescriptionFromName = function(name) {
    return CharStatSchema.descriptions[name];
};

var CharStat = mongoose.model('CharStat', CharStatSchema);
module.exports = CharStat;
