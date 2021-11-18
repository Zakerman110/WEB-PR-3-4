var mongoose = require('mongoose');
var log = require('./log')(module)
var config = require('./config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function(err) {
    log.error('connection error: ', err.message);
});

db.once('open', function callback() {
    log.info('Connected to DB!');
})

var Schema = mongoose.Schema; //Schemas

var Hero = new Schema({
    name: { type: String, required: true }
}); 

//validation
Hero.path('name').validate(function(v){
    return v.length > 2 && v.length < 70;
});

// Duplicate the ID field.
Hero.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
Hero.set('toJSON', {
    virtuals: true
});

var HeroModel = mongoose.model('Hero', Hero);

module.exports.HeroModel = HeroModel;