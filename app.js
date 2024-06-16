require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

main()
  .then(() => {
    console.log('Db Connected')
  })
  .catch((err) => {
    console.log(err)
  })

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, '/public')))

const sessionOptions = {
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
}

app.get('/', (req, res) => {
  res.send('Welcome')
})

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.currUser = req.user
  next()
})

// app.get('/demouser', async (req, res) => {
//   let fakeUser = new User({
//     email: 'student@gmail.com',
//     username: 'Bhai',
//   })
//   let reguser = await User.register(fakeUser, 'hello')
//   res.send(reguser)
// })

app.use('/listings', listingRouter)
app.use('/listings/:id/reviews', reviewRouter)
app.use('/', userRouter)

//invalid page
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found!'))
})

//middleware
app.use((err, req, res, next) => {
  let { status = 500, message = 'Something went wrong' } = err
  // res.status(status).send(message)
  res.status(status).render('error.ejs', { err })
})

const Port = process.env.PORT
app.listen(Port, () => {
  console.log(`server start at ${Port}`)
})
