const express = require('express')
const mongoose = require('mongoose') //library
const articleRouter = require('./routes/articles')
const app = express()

//connect to our database
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })

//view engine
// convert ejs to html
app.set('view engine', 'ejs')

// to exist to form in new article
app.use(express.urlencoded({ extended: false }))

//route
// render from views/index.ejs
app.get('/', (req,res)=>{
    const articles =[{
        title: 'Test Article',
        createdAt: new Date(),
        description: 'Test Description'
    }]
    res.render('articles/index', { articles: articles })
})

//route 
//render from article.js

app.use('/articles', articleRouter)

app.listen(8000)