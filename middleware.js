const Listing = require('./models/listing.js')
const Review = require('./models/review.js')
const { listingSchema, reviewSchema } = require('./schema.js')
const ExpressError = require('./utils/ExpressError.js')

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl
    req.flash('error', 'You must logged to craete listing')
    return res.redirect('/login')
  }
  next()
}

module.exports.saveredirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next()
}

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params
  let listing = await Listing.findById(id)
  if (!listing.owner._id.equals(req.user._id)) {
    req.flash('error', "you don't have permission to make any change")
    return res.redirect(`/listings/${id}`)
  }
  next()
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body)
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(400, errMsg)
  } else {
    next()
  }
}

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body)
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(400, errMsg)
  } else {
    next()
  }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewid } = req.params

  let review = await Review.findById(reviewid)

  if (!review.author._id.equals(req.user._id)) {
    req.flash('error', 'You are not allowed to delete this rating')
    return res.redirect(`/listings/${id}`)
  }
  next()
}
