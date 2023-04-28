const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
const User = require('./models/user.js')
const bodyParser = require('body-parser')
const noticias = require('./routes/noticias')
const restrito = require('./routes/restrito')
const session = require('express-session')

const mongoose = require ('mongoose')
mongoose.Promise = global.Promise
const mongo = process.env.MONGODB || 'mongodb://localhost:27017/noticias'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('index'))

app.use(express.static('public'))

app.use(session({ secret: 'junior' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/restrito', (req, res, next) => {
    if ('user' in req.session){
        return next()
    }
    res.redirect('login')
})
app.use('/restrito', restrito)
app.use('/noticias', noticias)
app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', async(req, res) => {
    const user = await User.findOne({ username: req.body.name})
    const isValid = await user.checkPassword(req.body.password)
    res.send({ user, isValid })

})

const createInitialUser = async () => {
    const total = await User.count({username: 'Reinaldo'})

    if(total === 0 ){
        const user = new User({
            username: 'Reinaldo',
            password: 'abc123'
        })
        await user.save()
        console.log('User created')
    }else{
        console.log('Error create user')
    }

}

mongoose.connect(mongo).then(() => {
    createInitialUser()
    app.listen(port, () => console.log('Listening in port: ' + port))
})
.catch(e => console.log(e))
