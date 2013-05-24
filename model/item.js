
/*
 * Item model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    TechLevel = require('./techlevel');

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

ItemSchema.defaultData = [
    {
        name:       "Ablative Suit",
        desc:       "Absorb the light",
        cost:       5000,
        category:   "Armor"
    },
    {
        name:       "Antique Revolver",
        desc:       "Bang bang",
        cost:       1200,
        category:   "Weapon",
    },
    {
        name:       "Laser Carbine",
        desc:       "zap",
        cost:       3600,
        category:   "Weapon",
    },
    {
        name:       "Car",
        desc:       "Vroom vroom",
        cost:       50000,
        category:   "Vehicle",
    }
];

ItemSchema.statics.initializeDB = function() {
    Item.findOne( {}, function(err,doc) {
        ItemSchema.defaultData.forEach( function(i) {
            // build the mod type dictionary
            if( !ItemSchema.typeArray)
                ItemSchema.typeArray = new Array();
            
            if( ItemSchema.typeArray.indexOf(i.category) == -1)
                ItemSchema.typeArray.push(i.category);

            if( !doc) {
                var newItem = new Item(i).save( function(err) {
                    if(err) return next(err);
                });
            };
        });
    });
};

ItemSchema.statics.generateListByType = function(callback) {
    var result = new Array();
    
    ItemSchema.typeArray.forEach( function(elem, index, arr) {
        Item.find({category:elem},
                 {name:1, category:1, cost:1},
                 {category:1, cost:1},
                 function(err,docs) {
                     if(err) return next(err);

                     result.push( docs);
                     
                     // if done, call callback
                     if( index == (arr.length-1))
                         callback( result);
                 });
    });
};

ItemSchema.methods.isEqual = function(itemObj) {
    if( (this._id == itemObj._id) ||
        (this.name == itemObj.name)
      ) {
        // TODO - complete equals operator
        throw "TODO - complete ItemSchema equals operator";
    }
    
    return false;
};

var Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
