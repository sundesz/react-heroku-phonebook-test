const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log('connected to Mongodb')
  })
  .catch((error) => {
    console.log('Error while connecting to Mongodb', error.message)
  })

const phonebook = new mongoose.Schema({
  name: String,
  number: String,
})

phonebook.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('PhoneBook', phonebook)
