var Books = require('../models/books.js')
var bookSearch = require('google-books-search')

var Book = require('../models/books')

function BooksHandler() {

	this.displayAllBooks = function(req, res){
		Books.find({}, function(err, results){
			res.locals.allBooks = results
			console.log(results)
			res.render('index')
		})
	}

	this.myBooks = function(req, res){
		Books.find({ belongsTo: req.user.local.email }, function(err, results){
			res.locals.myBooks = results
			res.render('myBooks', { message: req.flash('myBooksMessage') })
		})
	}

	this.search = function(req, res){
		bookSearch.search(req.body.book, {type: 'books'}, function(err, results){
			if(!err){
				console.log(results)
				res.locals.books = results
				console.log(results.length)
				res.render('addbook')
			}else{
				console.log(err)
			}
		})
	}

	this.displaySearched = function(req, res){
		res.render('addbook')
	}

	this.addBook = function(req, res){
		bookSearch.lookup(req.params.id, function(err, result){
			if(!err){
				console.log(result)
				var newBook = new Book
				newBook.title = result.title,
				newBook.authors = result.authors,
				newBook.publisher = result.publisher,
				newBook.publishedDate = result.publishedDate,
				newBook.description = result.description.replace(/ *?\<[^>]*?\> *? */g, ''),
				newBook.thumbnail = result.thumbnail,
				newBook.moreInfo = result.moreInfo,
				newBook.belongsTo = req.user.local.email
				newBook.save()
				req.flash('myBooksMessage', 'Book Added!')
				res.redirect('/mybooks')
			}else{
				console.log(err)
			}
		})
		
	}

}

module.exports = BooksHandler