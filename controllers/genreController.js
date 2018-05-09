var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Genre.
exports.genre_list = function(req, res) {
    
    Genre.find()
    	.sort([['name', 'ascending']])
    	.exec(function (err, list_genre) {
    		if(err) { return next(err); }
    		//list_genre is an object that holds our query results
    		//accessed in the view via genre_list.name
    		res.render('genre_list', {title: 'Genre List', genre_list: list_genre});
    	});
};
// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
          Book.find({'genre': req.params.id })
          .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });

};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {
    res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
// passing an array of middleware functions. The array is passed to the router fuction and each method is called in order
// this is needed because sanitisers/validators are middleware functions
exports.genre_create_post =  [
   
    // Validate that the name field is not empty.
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    // sanitiers run during validation do not modify the request
    // so use trim() to remove white spaces
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre(
          { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ 'name': req.body.name })
                .exec( function(err, found_genre) {
                     if (err) { return next(err); }

                     if (found_genre) {
                         // Genre exists, redirect to its detail page.
                         res.redirect(found_genre.url);
                     }
                     else {

                         genre.save(function (err) {
                           if (err) { return next(err); }
                           // Genre saved. Redirect to genre detail page.
                           res.redirect(genre.url);
                         });

                     }

                });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next) {
    async.parallel({
      genre: function(callback) {
        Genre.findById(req.params.id).exec(callback)
      },
      genre_books: function(callback) {
        Book.find({'genre': req.params.id}).exec(callback)
      },
    }, function(err, results) {
      if (err) {return next(err);}
      if (results.genre==null) {
        res.redirect('/catalog/genres');
      }
      res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books} );
    } );
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res, next) {
    async.parallel({
        genre: function(callback) {
          Genre.findById(req.body.genreid).exec(callback)
        },
        genre_books: function(callback) {
          Book.find({ 'genre': req.body.genreid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.genre_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            // req.body.genreid is the genre id from the form in genre_delete
            Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/catalog/genres')
            })
        }
    });
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};