const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//const validator = require('../utils/validator')

const UrlSchema = new mongoose.Schema({ 
    
    longUrl: {
        type: String,
        required: "Long url is required", 
        trim: true,
        unique: true,
    }, 
    shortUrl: {
        type: String,
        unique:true
    },
    urlCode: { 
        type: String,
        lowercase: true,
        trim: true
    }
})
UrlSchema.path('longUrl').validate((val) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');
uniqueValidator.defaults.message = "The longUrl already exist !"
UrlSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Url', UrlSchema)

