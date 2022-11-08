const mongoose = require('mongoose');
const {DateTime} = require("luxon");

const Schema = mongoose.Schema;

const bookInstanceSchema = new Schema({
    book:{type:Schema.Types.ObjectId , ref:"Book" , required:true},
    imprint:{type:String , required:true},
    status:{
        type:String , 
        required:true,
        enum:["Available" , "Maintenance" , "Loaned" , "Reserved" ],
        default:"Maintenance",
    },
    due_book:{type:Date , default: Date.now },

});

bookInstanceSchema.virtual('url').get(function(){
    return `/catalog/bookInstance/${this._id}` ;
});

bookInstanceSchema.virtual('due_back_formatted').get(function(){
    return DateTime.fromJSDate(this.due_book).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("BookInstace" , bookInstanceSchema);