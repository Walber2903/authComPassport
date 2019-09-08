const express = require('express')

const router = express.Router()
const Noticia = require('../models/noticia')

router.get('/', async (req, res) => {
    const conditions = { category: 'public' }
    const noticias = await Noticia.find(conditions)
    res.render('noticias/index', { noticias })
})

module.exports = router