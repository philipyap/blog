const express = require('express')
const mongoose = require('mongoose') //library
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverrid = require('method-override')
const app = express()

//connect to our database
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

//view engine
// convert ejs to html
app.set('view engine', 'ejs')

// to exist to form in new article
app.use(express.urlencoded({ extended: false }))

//method override 
app.use(methodOverrid('_method'))

//route
// render from views/index.ejs
app.get('/', async (req,res)=>{
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', { articles: articles })
})

//route 
//render from article.js

app.use('/articles', articleRouter)

app.listen(8000)