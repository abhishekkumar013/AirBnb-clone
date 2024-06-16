const Listing = require('../models/listing')

module.exports.index = async (req, res) => {
  let datas = await Listing.find()
  res.render('listing/index.ejs', { datas })
}
module.exports.renderNewForm = (req, res) => {
  res.render('listing/newform.ejs')
}

module.exports.showRoutes = async (req, res) => {
  let { id } = req.params
  let data = await Listing.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('owner')
  if (!data) {
    req.flash('error', 'Reuested Listing Not Found!')
    res.redirect('/listings')
  }
  // console.log(data)
  res.render('listing/show.ejs', { data })
}

module.exports.newListingCreate = async (req, res, next) => {
  // let { ftitle, fdescription, furl, fprice, flocation, fcountry } = req.body
  let url = req.file.path
  let filename = req.file.filename
  const newlisting = new Listing(req.body.listing)
  newlisting.owner = req.user._id
  newlisting.image = { url, filename }
  await newlisting.save()
  req.flash('success', 'New Listing Created!')
  res.redirect('/listings')
}

module.exports.editForm = async (req, res) => {
  let { id } = req.params
  let data = await Listing.findById(id)
  if (!data) {
    req.flash('error', 'Reuested Listing Not Found!')
    res.redirect('/listings')
  }
  let originalImgUrl = data.image.url
  originalImgUrl = originalImgUrl.replace('/upload', '/upload/h_300,w_250')
  res.render('listing/edit.ejs', { data, originalImgUrl })
}

module.exports.updateRoutes = async (req, res) => {
  let { id } = req.params

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

  if (typeof req.file !== 'undefined') {
    let url = req.file.path
    let filename = req.file.filename
    listing.image = { url, filename }
    await listing.save()
  }
  req.flash('success', 'Listing Updated successfully!')
  res.redirect(`/listings/${id}`)
}
module.exports.deleteRoutes = async (req, res) => {
  let { id } = req.params
  await Listing.findByIdAndDelete(id)
  req.flash('success', 'Listing Deleted!')
  res.redirect('/listings')
}
