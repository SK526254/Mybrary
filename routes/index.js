const express = require('express')
const bodyParser = require("body-parser")
const router = express.Router()

router.get("/" ,(req , res)=>{
    res.render("index")
})

router.get("/home"  ,  (req , res)=>{
    res.render("home")
})


// exporting whole routes  
module.exports  =  router 