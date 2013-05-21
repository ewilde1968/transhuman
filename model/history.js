
/*
 * History model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var HistorySchema = new Schema( {
    name:       String,
    desc:       String,
    datetime:   Date
});

var History = mongoose.model('History', HistorySchema);
module.exports = History;
