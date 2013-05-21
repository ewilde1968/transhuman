
/*
 * Profession model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ProfessionSchema = new Schema( {
    name:       String,
    desc:       String,
    specialty:  String,
    level:      Number
});

ProfessionSchema.defaultData = [
    {
        populationType: 'Rural Hamlet',
        professions: ['Farmer','Scientist','Engineer','Journalist','Artisan']
    },
    {
        populationType: 'Extraterrestrial Hamlet',
        professions: ['Farmer','Scientist','Engineer','Journalist','Artisan']
    },
    {
        populationType: 'Earth Village',
        professions: ['Farmer','Scientist','Engineer','Journalist','Artisan']
    },
    {
        populationType: 'Extraterrestrial Village',
        professions: ['Farmer','Scientist','Engineer','Journalist','Artisan']
    },
    {
        populationType: 'Earth City',
        professions: ['Farmer','Scientist','Engineer','Journalist','Artisan']
    },
    {
        populationType: 'Extraterrestrial City',
        professions: ['Farmer','Scientist','Engineer','Journalist','Artisan']
    },
    {
        populationType: 'Orbital Station',
        professions: ['Farmer','Scientist','Engineer','Journalist','Artisan']
    }
];


ProfessionSchema.statics.getAvailableProfessions = function(populationType) {
    for(var i=0;i<ProfessionSchema.defaultData.length;i++) {
        if( populationType == ProfessionSchema.defaultData[i].populationType) {
            return ProfessionSchema.defaultData[i].professions;
        }
    }

    throw 'ProfessionSchema:getAvailableProfessions populationType out of range';
};

var Profession = mongoose.model('Profession', ProfessionSchema);
module.exports = Profession;
