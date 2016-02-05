var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// item Schema

var itemSchema = new Schema({

		name: {type:String, es_indexed:true},
		image: String,
		gender: {type:String, es_indexed:true},
		color: {type:String, es_indexed:true},
		type: {type:String, es_indexed:true},
		detail: {type:Array, es_indexed:true},
		brand: {type:String, es_indexed:true},
		brand_url: String,
		item_url: String

	 	


});

itemSchema.plugin(mongoosastic,{hydrate:true, hydrateOptions: {lean: true}}); 

module.exports = mongoose.model('item', itemSchema);	