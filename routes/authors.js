const express = require('express')
const router = express.Router()

//importing author model from models
const Author = require("../models/author.js") 


// All authors route
router.get("/" ,async (req , res)=>{
    let searchOptinos = {}
    if(req.query.name != null && req.query.name !== ""){
        searchOptinos.name = new RegExp(req.query.name , 'i')
    }
    try {
        const authors = await Author.find(searchOptinos)
        
        res.render("authors/index" , {
            authors : authors , 
            searchOptions :req.query
        })
        
    } catch  {
        res.redirect("/")
    }
})

// new authors route
router.get("/new" ,(req , res)=>{
    res.render("authors/new" , {author : new Author() })
})
// create author
router.post("/" ,async (req , res)=>{
    const author = new Author({
        name : req.body.name
    })

    try {
        const newAuthor =  await author.save()
        // res.redirect("authors/${newAuthor.id}")
            res.redirect("authors")
    } catch  {
        res.render("authors/new", {
            author : author,
            errorMessage : "error creating author"
        }) 
    }
    // author.save((err, newAuthor)=>{
    //     if(err){
            
    //         res.render("authors/new", {0
    //             author : author,
    //             errorMessage : "error creating author"
    //         })      
    //     }else{
    //         // res.redirect("authors/${newAuthor.id}")
    //         res.redirect("authors")

    //     }
    // })
   
})


// exporting whole routes  
module.exports  =  router