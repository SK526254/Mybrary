if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();  
}

const express  = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")

// importing whole routes from the index.js file in Routes
const indexRouter = require("./routes/index")

app.set("view engine" , "ejs")
// setting views folder as the views
app.set("views" , __dirname + "/views")
// setting the layout file for entire ejs files
app.set("layout" , "layouts/layout")
app.use(expressLayouts)
app.use(express.static("public"))

const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser : true})
const db = mongoose.connection
db.on('error' , error =>console.error(error))
db.once('open' , () =>console.log("connected to mongoose"))

// using starting routing point by App
app.use("/" , indexRouter)

app.listen(process.env.PORT || 3000 , ()=>{
    console.log("Server stated");
}) 