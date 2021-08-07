const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide password as an argument: node mongo.js password')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://sandesh:${password}@cluster0.xu9kp.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const PhoneBook = mongoose.model('PhoneBook', phoneBookSchema)

if (process.argv.length === 3) {
  PhoneBook.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((phonebook) => {
      console.log(phonebook.name, phonebook.number)
    })

    mongoose.connection.close()
  })
}

if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]

  const phoneBook = new PhoneBook({
    name: name,
    number: number,
  })

  phoneBook.save().then((result) => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
