const mongoose = require('mongoose')

const noticiaSchema = new mongoose.Schema({
    id: String,
    content: String,
    category: String,
})

const Noticia = mongoose.model('Noticia', noticiaSchema)

module.exports =  Noticia

