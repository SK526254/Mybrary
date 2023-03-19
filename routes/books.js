const express = require('express')
const router = express.Router()
const multer = require('multer')
const path  = require('path')
const fs = require('fs')
//importing author model from models
const Book = require("../models/book.js") 
const Author = require("../models/author.js") 

const uploadPath = path.join('public' , Book.coverImageBasepath)
const imageMimeTypes = ['image/jpeg' , 'image/png' , 'image/gif']

const upload = multer({
    dest: uploadPath,
    fileFilter : (req , file ,callback)=>{
        callback(null , imageMimeTypes.includes(file.mimetype))
    }
})


// All books route
router.get("/" ,async (req , res)=>{
    // console.log(req.query);
    const title = req.query.title;
    const publishedBefore = req.query.publishedBefore;
    const publishedAfter = req.query.publishedAfter;

    // querying DB 
    // let books = await Book.find({title : { $regex : title}}).find({publisheDate :{$gte : publishedAfter}}).find({publisheDate :{$lte : publishedBefore}})
    let books = await Book.find({});
   
    try {
        res.render('books/index' , {
            books : books,
            searchOptions : req.query
        })
    } catch  {
        res.redirect('/')
    }
   
})

// new book route
router.get("/new" ,async (req , res)=>{
   
    renderNewPage(res ,new Book())

})


// create book
router.post("/" ,upload.single('cover'),  async (req , res)=>{
    const fileName= req.file != null ? req.file.filename : null
    
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publisheDate : new Date(req.body.publisheDate),
        pageCount : req.body.pageCount,
        coverImageName : fileName,
        description : req.body.description
    })
   try {
    const newBook = await book.save()
    // res.redirect('books/${newBook.id}')
    res.redirect('books')
   } catch  {
    if(book.coverImageName != null){
        removeBookCover(book.coverImageName);
    }
    renderNewPage(res ,book, true)
    
   }
})

function removeBookCover(fileName ){
    fs.unlink(path.join(uploadPath , fileName) , err=>{
        if(err) console.error(err)
    })
}
async function renderNewPage (res , book , hasError = false){
    try {
        const authors = await Author.find({})
        const params = {
        authors : authors,
        book: book
     }
      if(hasError) params.errorMessage = "Error creating Book"
        res.render("books/new" , params)
    } catch  {
        res.redirect("/books")
    }
}


// exporting whole routes  
module.exports  =  router





// // let query = await Book.find({})
    // let searchOptions = {}
    // let books = await Book.find({})
    // // let query = await Book.find()

    //  if(req.query.title != null && req.query.title != ""){
    //     // query = query.regex('title' , new RegExp(req.query.title , 'i'))
    //     const option = '/'+ req.query.title + '/i'
    //     searchOptions.title = option;
    // }{ title: { $regex: req.query.title}  }


     // console.log(query);
    // // if(req.query.publishedBefore != null && req.query.publishedBefore != ""){
    // //     query = query.lte('publishedBefore' , req.query.publishedBefore , 'i')
    // //     // searchOptions.publisheDate = 
    // //     // {$lge : ${req.query.}}
    // // }  
    //  if(req.query.publishedAfter != null && req.query.publishedAfter != ""){
    //     query = query.gte('publishedAfter' ,req.query.publishedAfter , 'i')
    // }
    // const user = await User.find({ email: 'john@acme.com', hashedPassword: { $ne: null } }).setOptions({ sanitizeFilter: true });
