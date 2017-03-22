var Book = require('../models/books.js')
var bookSearch = require('google-books-search')

function BookHandler() {

	this.displayAllBooks = function(req, res){
		Book.find({}, function(err, results){
			res.locals.allBooks = results
			res.render('index', { message: req.flash('allBooksMessage') })
		})
	}

	this.myBooks = function(req, res){
		Book.find({ belongsTo: req.user.local.email }, function(err, results){
			res.locals.myBooks = results
			res.render('myBooks', { message: req.flash('myBooksMessage') })
		})
	}

	this.search = function(req, res){
		bookSearch.search(req.body.book, {type: 'books'}, function(err, results){
			if(!err){
				res.locals.books = results
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
			console.log(result.authors.length)
			if(!err){
				var newBook = new Book
				var authors = []
				for(i=0; i < result.authors.length; i++){
					result.authors[i] = ' ' + result.authors[i]
				}
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

	this.askTrade = function(req, res){
		Book.findOne( { _id: req.params.bookId }, function(err, result){
			if(!err){
				tradeableBook = result
				console.log(tradeableBook.tradeRequestUsers.indexOf(req.user.local.email))
				if(tradeableBook.tradeRequestUsers.indexOf(req.user.local.email) < 0){
					tradeableBook.tradeRequestUsers.push(req.user.local.email)
					tradeableBook.save()
					req.flash('allBooksMessage', `You asked ${tradeableBook.belongsTo} for ${tradeableBook.title}.`)
				}else{
					req.flash('allBooksMessage', `You already asked ${tradeableBook.belongsTo} for ${tradeableBook.title}.`)
				}
				res.redirect('/')
			}else{
				console.log(err)
			}
		})
	}

	this.showTrades = function(req, res){
		//Display my books with trade requests
		Book.find( { belongsTo: req.user.local.email }, function(err, results){
			if(!err){
				var myBooksWithTrade = []
				for(i=0; i < results.length; i++){
					if(results[i].tradeRequestUsers.length > 0){
						myBooksWithTrade.push(results[i])
					}
				}
				res.locals.myBooksWithTrade = myBooksWithTrade
				Book.find( { tradeRequestUsers: req.user.local.email }, function(err2, results2){
					if(!err2){
						res.locals.booksIveRequested = results2
						res.render('trades', { message: req.flash('tradesMessage') })
					}else{
						console.log(err2)
					}
				})
			}else{
				console.log(err)
			}
		})
	}

	this.confirmTrade = function(req, res){
		Book.findOne( { _id: req.query.bookid }, function(err, result){
			var bookInTrade = result
			if(!err){
				if(req.params.accept === 'accept'){ //User accepted trade
					console.log('User asking to trade: ' + req.query.user)
					console.log('User accepting to trade: ' + req.user.local.email)
					bookInTrade.belongsTo = req.query.user
					var indexToRemove = bookInTrade.tradeRequestUsers.indexOf(req.query.user)
					bookInTrade.tradeRequestUsers.splice(indexToRemove, 1)
					bookInTrade.save()
					res.redirect('/trades')
				}else{
					console.log('Canceling trade...')
					var indexToRemove = bookInTrade.tradeRequestUsers.indexOf(req.query.user)
					bookInTrade.tradeRequestUsers.splice(indexToRemove, 1)
					bookInTrade.save()
					res.redirect('/trades')
				}
			}else{
				console.log(err)
			}
		})
	}

}

module.exports = BookHandler