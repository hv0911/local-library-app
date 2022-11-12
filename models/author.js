const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    firstName:{ type:String  , required : true , maxLength:100} ,
    familyName:{ type:String  , required : true , maxLength:100} ,
    dateOfBirth:{type:Date},
    dateOfDeath:{type:Date},

});

// defining a virtual for author
authorSchema.virtual('name').get(function(){

    let fullName = '';
    if(this.firstName && this.familyName){
        fullName = `${this.familyName} , ${this.firstName}`
    }
    if(!this.firstName || !this.familyName){
        fullName = '';
    }

    return fullName;
});


 //virtula url 
authorSchema.virtual('url').get(function(){
    return `/catalog/author/${this._id}` ;
});

authorSchema.virtual('DOB').get(function(){
    return this.dateOfBirth ? DateTime.fromJSDate(this.dateOfBirth).toLocaleString(DateTime.DATE_MED) : " " ;
})

authorSchema.virtual('DOD').get(function(){
    return this.dateOfDeath? DateTime.fromJSDate(this.dateOfDeath).toLocaleString(DateTime.DATE_MED) : " " ;
})

authorSchema.virtual('deathOfBirth_yyyy_mm_dd').get(function(){
    return  DateTime.fromJSDate(this.dateOfBirth).toISODate() ;
})
authorSchema.virtual('deathOfDeath_yyyy_mm_dd').get(function(){
    return  DateTime.fromJSDate(this.dateOfDeath).toISODate() ;
})

module.exports = mongoose.model("Author" , authorSchema);