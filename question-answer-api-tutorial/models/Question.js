const { request } = require('express');
const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    title : {
        type : String,
        required : [true,"Please provide a title"],
        minlenght : [10,"Please provide a title at least 10 characters"],
        unique : true
    },
    content : {
        type : String,
        required : [true,"provide a content"],
        minlenght : [20,"Please provide a title at least 20 characters"]
    },
    slug : String,
    createdAt : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    },
    likeCount : {
        type : Number,
        default : 0
    },
    likes : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ],
    answerCount: {
        type : Number,
        default : 0
    },
    answers : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Answer"
        }
    ]
});
// Pre-save middleware to automatically generate a slug
QuestionSchema.pre("save",function(next){
    if (!this.isModified('title')) {
        return next();
    }
    
    this.slug = this.makeSlug();
    this.updatedAt = Date.now();
    next();
});
// Slug generation function
QuestionSchema.methods.makeSlug = function(){
    return slugify(this.title, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: true,     // strip special characters except replacement, defaults to `false`
        locale: 'tr',      // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
    });
};


module.exports = mongoose.model("Question",QuestionSchema)