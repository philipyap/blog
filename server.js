const express = require('express')
const mongoose = require('mongoose') //library
const articleRouter = require('./routes/articles')
const app = express()

//connect to our database
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })

//view engine
// convert ejs to html
app.set('view engine', 'ejs')

//route 
//render from article.js
app.use('/articles', articleRouter)

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

app.listen(8000)