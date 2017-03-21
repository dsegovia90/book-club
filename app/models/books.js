var mongoose = require('mongoose')
var Schema = mongoose.Schema


var Book = new Schema({
	
	title: String,
	authors: Array,
	publisher: String,
	publishedDate: String,
	description: String,
	thumbnail: String,
	moreInfo: String,
	belongsTo: String

})


module.exports = mongoose.model('Book', Book)