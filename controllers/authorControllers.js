const Author = require('../models/author');


// Display the list of all the author
exports.authorList = (req,res)=>{
   
    Author.find()
       .sort([["familyName","ascending"]])
       .exec((err,data)=>{

        if(err){
            console.log(err);
        }
        //on sucess
        res.render("author_list",{title:"AUTHOR LIST" , author_list:data});

       });

}

//Display the information(details) of a specific author
exports.authorDetails = (req,res)=>{
    res.send(`Not Implementd: Author Detail:${req.params.id} `);
}

//Display authors create form
exports.authorCreateGet = (req,res)=>{
    res.send("Not Implemented: Author Create Form");
}

//Handle authors create form
exports.authorCreatePost = (req,res)=>{
    res.send("Not Implementd : Author created! ");
}

//Display authors update form
exports.authorUpdateGet = (req,res)=>{
    res.send("Not Implemented : Author Update form");
};

//Handle author update form
exports.authorUpdatePost = (req,res)=>{
    res.send("Not Implemented : Author upadated!");
};

//Display authors delete form
exports.authorDeleteGet = (req,res)=>{
    res.send("Not Implemented : Author delete Form");
}

//Handle auhtors delte form
exports.authorDeletePost = (req , res) =>{
    res.send("Not Implemented: Author delelted! ");
}