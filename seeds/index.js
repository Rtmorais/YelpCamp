const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')
const axios = require('axios')

mongoose
  .connect('mongodb://localhost:27017/yelp-camp')
  .then(() => {
    console.log('DATABASE CONNECTED')
  })
  .catch(err => {
    console.log('CONNECTION ERROR:')
    console.log(err)
  })

const seedImg = async () => {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: 'fqMeGRIukKwVsPt2_YrRAgkrbLxWG7rVsBXTKVqkTzo',
        collections: 10489597
      }
    })
    return resp.data.urls.regular
  } catch (err) {
    console.log('ERROR UNSPLASH API:', err)
  }
}

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 48; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      image: await seedImg(),
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi quas saepe facilis nesciunt voluptatem rem corrupti nam quis? Asperiores vel voluptate earum ea ducimus neque maiores dolorum autem debitis voluptas? Voluptates, perspiciatis nostrum. Modi commodi, qui quasi magnam quod saepe aperiam doloribus assumenda hic ullam eum reprehenderit deserunt sint enim. Fugit, distinctio neque odio animi blanditiis cumque corrupti officia corporis? ',
      price: price
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
