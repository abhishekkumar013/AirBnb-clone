const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const passport = require('passport')
const { saveredirectUrl } = require('../middleware.js')

const UserController = require('../controllers/users.js')

router
  .route('/singup')
  .get(UserController.singUpForm)
  .post(wrapAsync(UserController.postSingup))

router
  .route('/login')
  .get(UserController.loginForm)
  .post(
    saveredirectUrl,
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    wrapAsync(UserController.loginPost),
  )

router.get('/logout', UserController.logout)

module.exports = router
