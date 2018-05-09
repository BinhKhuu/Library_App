var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
	{
		first_name: {type: String, required: true, max: 100},
		family_name: {type: String, required: true, max: 100},
		date_of_birth: {type: Date},
		date_of_death: {type: Date},
	}
);

/** virtual for author's full name
  * virtual are attributes that do not get persisted to mongodb.
  * here AuthorSchema.name will return "famil_name, first_name"
  * but it is not saved on the database
  */
AuthorSchema
.virtual('name')
.get(function () {
	return this.family_name + ',' + this.first_name;
})
/** virtual for url
  *	AuthorSchema.url = "/catalog/author/_id"
  */
AuthorSchema
.virtual('url')
.get(function(){
	return '/catalog/author/' + this._id;
});

AuthorSchema
.virtual('dob')
.get(function() {
	return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
});

AuthorSchema
.virtual('dod')
.get(function() {
	return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : '';
});

AuthorSchema
.virtual('lifespan')
.get(function() {
	var lifespan;
	if( !this.date_of_birth && ! this.date_of_death ) lifespan = "Unknown";
	else if ( !this.date_of_birth ) lifespan = "Unkown - " + moment(this.date_of_death).format('MMMM do, YYYY');
	else if ( !this.date_of_death ) lifespan = moment(this.date_of_birth).format('MMMMM do, YYYYY') + " - Still alive";
	else lifespan = moment(this.date_of_birth).format('MMMM Do, YYYY') + " - " + moment(this.date_of_death).format('MMMM Do, YYYY')
	return lifespan;
});

module.exports = mongoose.model('Author', AuthorSchema);