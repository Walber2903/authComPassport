const express = require("express")
const app = express()
const path = require("path")
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const User = require('./models/user')
const Noticia = require('./models/noticia')

const noticias = require('./routes/noticias')
const restrito = require('./routes/restrito')
const auth = require('./routes/auth')
const pages = require('./routes/pages')
const admin = require('./routes/admin')
const session = require('express-session')
const bodyParser = require('body-parser')

const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(session({ secret: 'fullstack-master'}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.use('/', auth)
app.use('/', pages)

app.use('/restrito', restrito)
app.use('/noticias', noticias)
app.use('/admin', admin)

const createInitialUser = async() => {
    const total = await User.countDocuments({ })
    if(total === 0) {
        const user = new User({
            username: 'walber',
            password: '1506',
            roles: ['restrito', 'admin']
        })
        await user.save()
        console.log('user created')

        const user2 = new User({
            username: 'user2',
            password: '1506',
            roles: ['restrito']
        })
        await user2.save()
        console.log('user created')

    }else {
        console.log('user created skipped')
    }

    /*
    const noticia = new Noticia({
        title: 'testando a noticia publica em ' + new Date().getTime(),
        content: 'conteudo a ser preenchido',
        category: 'public'
    })
    await noticia.save()

    const noticia2 = new Noticia({
        title: 'testando a noticia privada em ' + new Date().getTime(),
        content: 'conteudo a ser preenchido',
        category: 'private'
    })
    await noticia2.save()
    */
}


mongoose
    .connect(mongo)
    .then(() => {
        createInitialUser()
        app.listen(port, () => console.log('listening...'))
    })
    .catch( e => console.log(e))
  
/*
const User = require('./models/user')
const user = new User({
    username: 'walberaraujo',
    password: '1506',
    role: ['']
})

user.save(() => console.log('salvo...'))
*/