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
###### ``` marked``` is to turn markdown into HTML
###### ``` slugify ``` is convert something to friendly url slug

###### 6. we need an action/method for the DELETE/PUT. Install a library ```npm i method-override``` https://dev.to/moz5691/method-override-for-put-and-delete-in-html-3fp2

###### 7. install ```npm i dompurify jsdom```
###### ```dompurify``` is to sanitize our html and prevent XSS attacks
###### ```jsdom``` is to render html inside nodeJS because nodeJS doesn't know how html works
###### https://www.npmjs.com/package/dompurify

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
###### 5. To prevent XSS attacks and sanitize our HTML:
```./models/article``` 
```
const marked = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom') // {} because we just want a portion what we want to return from jsdom
const dompurify = createDomPurify(new JSDOM().window) // allow to purify by using JSDOM().window function

},
    sanitizedHtml:{
        type: String,
        required: true
    }

articleSchema.pre('validate', function(next){
    if (this.title){
        this.slug = slugify(this.title, {
            lower: true, // slug is lower case
            strict: true // make sure we don't end the title but just letters
        })
    }
if (this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }

```

###### 6. edit route:
###### ```article.js```
```
// edit route
router.get('/edit/:id', async (req,res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})
```
###### create a middleware for put route. Just use the value we have in post route already and turn it to a function 
```
// middleware to pass in to put and post route
function saveArticleAndRedirect(path) {
    return async (req,res) => {
        let article = req.article
            article.title = req.body.title
            article.description = req.body.description
            article.markdown = req.body.markdown
        
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            res.render(`/articles/${path}`, { article: article })
        }
     }
    }

```
###### the rewrite the post route and create a new put route
```
// post to article page
// next parameter means to go on to the next function on the list
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
 }, saveArticleAndRedirect('new')) // pass in middleware and direct to new page
 
// put route for showing after edit
// method is about same as post route above
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
 }, saveArticleAndRedirect('edit')) // pass in middleware and direct to edit page
```