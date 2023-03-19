if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();  
}

const express  = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")


// importing whole routes from the index.js file in Routes
const indexRouter = require("./routes/index")
// importing author routes from the author.js 
const authorRouter = require("./routes/authors")
const bookRouter = require("./routes/books")



app.set("view engine" , "ejs")
// setting views folder as the views
app.set("views" , __dirname + "/views")
// setting the layout file for entire ejs files
app.set("layout" , "layouts/layout")
app.use(expressLayouts)
app.use(express.static("public"))
app.use(bodyParser.urlencoded({limit: "10mb" , extended : false}))

const mongoose = require('mongoose');
const author = require('./models/author');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser : true})
const db = mongoose.connection
db.on('error' , error =>console.error(error))
db.once('open' , () =>console.log("connected to mongoose"))

const errorMessage = "";
// using starting routing point by App
app.use("/" , indexRouter)
// using author routes from /authors => /authors/new , /authors/
app.use("/authors" , authorRouter)
// using book routes from /book = > book
app.use("/books" , bookRouter)


app.listen(process.env.PORT || 3000 , ()=>{
    console.log("Server stated");
}) 