const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) =>{
    res.render('articles/new', {article: new Article() })
})

// edit route
router.get('/edit/:id', async (req,res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

// return back to the page
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })

})

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

 // delete route
router.delete('/:id', async (req,res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

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


module.exports = router
