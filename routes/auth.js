const express = require('express')

const router = express.Router()
const User = require('../models/user')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

//definindo a estratégia para login local com passport
passport.use( new LocalStrategy(async(username, password, done) => {
    const user = await User.findOne( {username} )
    if(user) {
        const isValid = await user.checkPassword(password)
        if(isValid){
            return done(null, user)
        }else {
            return done(null, false)
        }
    }else{
        return done(null, false)
    }
}))

//checando se o usuario esta logado com passport
router.use((req, res, next) => {
    if(req.isAuthenticated()) {
        res.locals.user = req.user
        if(!req.session.role) {
            req.session.role = req.user.roles[0]
        }
        res.locals.role = req.session.role
    }
    next()
})

/*
//checando se o usuario esta logado manualmente
router.use((req, res, next) => {
    if('user' in req.session) {
        res.locals.user = req.session.user
        res.locals.role = req.session.role
    }
    next()
})
*/

//trocando os papéis com o passport
router.get('/change-role/:role', (req, res) => {
    if(req.isAuthenticated()) {
        if(req.user.roles.indexOf(req.params.role) >= 0) {
            req.session.role = req.params.role
        }
    }
    res.redirect('/')
})

/*
//trocando os papeis manualmente
router.get('/change-role/:role', (req, res) => {
    if('user' in req.session) {
        if(req.session.user.roles.indexOf(req.params.role) >= 0) {
            req.session.role = req.params.role
        }
    }
    res.redirect('/')
})
*/

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

/*
//definindo a estratégia com manualmente
router.post('/login', async(req, res) => {
    const user = await User.findOne({username: req.body.username})
    if(user){
        const isValid = await user.checkPassword(req.body.password)

        if(isValid){
            req.session.user = user
            req.session.role = user.roles[0]
            res.redirect('/restrito/noticias')
        }else {
            res.redirect('/login')
        }
    }else {
        res.redirect('/login')
    }
    
})
*/

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}))

module.exports = router