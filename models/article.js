const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')

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
    next()
})

module.exports = mongoose.model('Article', articleSchema)