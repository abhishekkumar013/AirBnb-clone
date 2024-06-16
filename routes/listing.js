const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const { isLoggedIn, isOwner, validateListing } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage })

const listingController = require('../controllers/listings.js')

//indexs
router
  .route('/')
  .get(wrapAsync(listingController.index))
  // listing post(create routes)
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.newListingCreate),
  )

//new routes
router.get('/new', isLoggedIn, listingController.renderNewForm)

router
  .route('/:id')
  //show routes
  .get(wrapAsync(listingController.showRoutes))
  //update Routes
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateRoutes),
  )
  //delete
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteRoutes))

//edit
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm),
)

module.exports = router
