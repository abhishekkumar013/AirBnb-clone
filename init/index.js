const mongoose = require('mongoose')
const InitData = require('./data.js')
const Listing = require('../models/listing.js')

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

const initDb = async () => {
  await Listing.deleteMany({})
  InitData.data = InitData.data.map((obj) => ({
    ...obj,
    owner: '654920d8adbdf9949e63c9ca',
  }))
  await Listing.insertMany(InitData.data)
  console.log('Data inserted Successfully')
}
initDb()
