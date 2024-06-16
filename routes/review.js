const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const ReviewController = require('../controllers/reviews.js')
//Review
//post review route
router.post(
  '/',
  isLoggedIn,
  validateReview,
  wrapAsync(ReviewController.postReview),
)
// delete review route
router.delete(
  '/:reviewid',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(ReviewController.deleteReview),
)

module.exports = router
