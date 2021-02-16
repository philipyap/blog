### A Blog Post that using Mongoose, Express, and Node.js

###### * command + shift + v for preview

###### 1. start with ```npm init -y``` to install package.json

###### 2. install all depandencies```npm i express mongoose ejs```  : ```express``` allos us to create the server, ```mongoose``` is for database, and ```ejs``` is for different views.

###### 3. ```npm i --save--dev nodemon``` nodemon allows us to refresh the page when we make any changes.

###### 4. in ```package.json```, rewrite to
```
"scripts": {
    "devStart": "nodemon server.js"},
```    

###### 5. install ``` npm i marked slugify ```
``` marked``` is to turn markdown into HTML
``` slugify ``` is convert something to url slug

##### note: 

###### 1. to get the current date, in ```index.ejs``` 
```
 <%= article.createdAt.toLocaleDateString() %>
 // toLocaleDareString() helps you to get the current date instead of long useless date info
```
###### 2. to hook up to database:
 in ```server.js```
```
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })
```
###### 3. to first show the latest blog post:
in ```server.js``` 
```
app.get('/', async (req,res)=>{
    const articles = await Article.find().sort({createdAt: 'desc'}) /// {createdAt:'desc} to show the latest post
    res.render('articles/index', { articles: articles })
})
```
###### 4. instead of showing long id numbers on url, we change id to slug in order to get title of the article:
``` articles.js```
```
router.get('/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })

})
```
change to
```
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })

})
```

And instead of routing it to id, we also route it to slug
```
router.post('/', async (req,res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })
    try{
        article = await article.save()
        res.redirect(`/articles/${article.id}`)
    } catch (e) {
        res.render('/articles/new', { article: article })
    }
 })   
 ```
 to
 ```
 router.post('/', async (req,res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })
    try{
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    } catch (e) {
        res.render('/articles/new', { article: article })
    }
 }) 
 ```  
