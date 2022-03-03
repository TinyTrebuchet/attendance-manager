if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path')
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost/attendance", { family: 4 })

const Student = require('./models/student')
const Course = require('./models/course')

const tools = require('./helpers/script.js')


const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => Student.findOne({ "email": { $eq: email } }),
  id => Student.findOne({ "_id": { $eq: id } })
)

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', tools.checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})

app.get('/login', tools.checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', tools.checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', tools.checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', tools.checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await Student.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

app.get('/timetable', tools.checkAuthenticated, async (req, res) => {
  const today = new Date()
  const currentCourses = await tools.getCurrentCoursesWithName(req.user._id)

  res.render('timetable.ejs', { currentCourses: currentCourses, today: today })
})

app.get('/attendance', tools.checkAuthenticated, async (req, res) => {
  const currentCourses = await tools.getCurrentCoursesWithName(req.user._id)

  res.render('attendance.ejs', { currentCourses: currentCourses })
})

app.get('/courses', tools.checkAuthenticated, async (req, res) => {
  const currentCourses = await tools.getCurrentCoursesWithName(req.user._id)

  res.render('courses.ejs', { currentCourses: currentCourses })
})


app.use(express.static(path.join(__dirname, "public")));

app.listen(3000)