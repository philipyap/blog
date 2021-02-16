const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom') // {} because we just want a portion what we want to return from jsdom
const dompurify = createDomPurify(new JSDOM().window) // allow to purify by using JSDOM().window function

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true // to make sure we only have one slug
    },
    sanitizedHtml:{
        type: String,
        required: true
    }
})

// function to set to automatically save articles
// pass in function(next) parameter, if not we would get error
articleSchema.pre('validate', function(next){
    if (this.title){
        this.slug = slugify(this.title, {
            lower: true, // slug is lower case
            strict: true // make sure we don't end the title but just letters
        })
    }

    if (this.markdown){
        // (marked(this.markdown)) = convert our markdown to html
        // dompurify.sanitize(marked(this.markdown))  = purify any bad code when we convert our markdown in html
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown)) 
    }

    next()
})

module.exports = mongoose.model('Article', articleSchema)