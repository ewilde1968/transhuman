
/*
 * Homeland model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    TechLevel = require('./techlevel'),
    Mod = require('./mod');

var ModSchema = new Schema( {
    name:       String,
    desc:       String,
    type:       String,
    creditCost: Number,
    humanCost:  Number,
    prohibited: Array,      // array of Mod
    benefits:   Array,      // array of Benefit
    techLevel:  [TechLevel],      // TechLevel
});

ModSchema.defaultData = [
    {
        name: 'Alpha',
        desc: 'Better looks, better resistance, no defects',
        type: 'Chromosomal Selection',
        creditCost: 1000,
        humanCost: 0.1,
        prohibited: ['Ishtar', 'Tenin', 'Defect Screen']
    },
    {
        name: 'Ishtar',
        desc: 'Better looks, more carnal, more charismatic',
        type: 'Chromosomal Selection',
        creditCost: 1500,
        humanCost: 0.1,
        prohibited: ['Alpha', 'Tenin', 'Defect Screen']
    },
    {
        name: 'Tenin',
        desc: 'Zero-G adapted',
        type: 'Chromosomal Selection',
        creditCost: 2500,
        humanCost: 0.1,
        prohibited: ['Alpha', 'Ishtar', 'Defect Screen']
    },
    {
        name: 'Defect Screen',
        desc: 'No defects',
        type: 'Chromosomal Selection',
        creditCost: 0,
        humanCost: 0,
        prohibited: ['Alpha', 'Ishtar', 'Tenin']
    },
    {
        name: 'Sapient AI',
        desc: 'An AI in the hardware embedded within the body',
        type: 'Virtual Augmentation',
        creditCost: 8500,
        humanCost: 0.1,
        prohibited: []
    },
    {
        name: 'Upslink',
        desc: 'Ability to upload full sensory experiences',
        type: 'Virtual Augmentation',
        creditCost: 2500,
        humanCost: 0.1,
        prohibited: []
    },
    {
        name: 'Downslink',
        desc: 'Ability to download and experience full sensory uploads',
        type: 'Virtual Augmentation',
        creditCost: 2000,
        humanCost: 0.1,
        prohibited: []
    },
    {
        name: 'Virtual Interface',
        desc: 'Virtual reality interface surgically installed in the brain',
        type: 'Virtual Augmentation',
        creditCost: 1800,
        humanCost: 0.1,
        prohibited: []
    }
];

ModSchema.statics.initializeDB = function() {
    Mod.findOne( {}, function(err,doc) {
        ModSchema.defaultData.forEach( function(mod) {
            // build the mod type dictionary
            if( !ModSchema.typeArray)
                ModSchema.typeArray = new Array();
            
            if( ModSchema.typeArray.indexOf(mod.type) == -1)
                ModSchema.typeArray.push( mod.type);

            if( !doc) {
                var newMod = new Mod( mod).save( function(err) {
                    if(err) return next(err);
                });
            };
        });
    });
};

ModSchema.statics.generateListByType = function(callback) {
    var result = new Array();
    
    ModSchema.typeArray.forEach( function(elem, index, arr) {
        Mod.find({type:elem},
                 {name:1, type:1, creditCost:1, humanCost:1},
                 {type:1, humanCost:1, creditCost:1},
                 function(err,docs) {
                     if(err) return next(err);

                     result.push( docs);
                     
                     // if done, call callback
                     if( (index+1) == arr.length)
                         callback( result);
                 });
    });
};

var Mod = mongoose.model('Mod', ModSchema);
module.exports = Mod;
