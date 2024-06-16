const User = require('../models/user')

module.exports.singUpForm = (req, res) => {
  res.render('users/singup.ejs')
}

module.exports.postSingup = async (req, res) => {
  try {
    let { username, email, password } = req.body
    const newUser = new User({ email, username })
    const registerUser = await User.register(newUser, password)
    req.login(registerUser, (err) => {
      if (err) {
        return next(err)
      }
      req.flash('success', 'User Registered Successfully')
      res.redirect('/listings')
    })
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('/singup')
  }
}

module.exports.loginForm = (req, res) => {
  res.render('users/login.ejs')
}

module.exports.loginPost = async (req, res) => {
  req.flash('success', 'Welcome to Wanderlust')
  let redirectUrl = res.locals.redirectUrl || '/listings'
  res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err)
    }
    req.flash('success', 'Logout Successfully')
    res.redirect('/listings')
  })
}
