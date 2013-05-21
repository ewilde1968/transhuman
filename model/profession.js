
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
        name:'Farmer',
        desc:'Grows food.',
    },
    {
        name:'Scientist',
        desc:'Figures stuff out.',
    },
    {
        name:'Engineer',
        desc:'Makes things go.',
    },
    {
        name:'Journalist',
        desc:'Tells stories.',
    },
    {
        name:'Artisan',
        desc:'Makes life worth living.',
    }
];

var popTypes = [
    {
        populationType: 'Rural Hamlet',
        professions: ['Farmer','Scientist','Journalist','Artisan']
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


ProfessionSchema.statics.initializeDB
ProfessionSchema.statics.getAvailableProfessions = function(populationType) {
    for(var i=0;i<ProfessionSchema.defaultData.length;i++) {
        if( populationType == popTypes[i].populationType) {
            return popTypes[i].professions;
        }
    }

    throw 'ProfessionSchema:getAvailableProfessions populationType out of range';
};

ProfessionSchema.statics.getProfessionDescription = function(name) {
    for( i=0;i<ProfessionSchema.defaultData.length;i++) {
        if(ProfessionSchema.defaultData[i].name == name)
            return ProfessionSchema.defaultData[i].desc;
    }
    
    throw 'ProfessionSchema:newProfessionByName name out of range';
};

var Profession = mongoose.model('Profession', ProfessionSchema);
module.exports = Profession;
