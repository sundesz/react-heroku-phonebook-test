require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3001
const app = express()
const PhoneBook = require('./models/Phonebook')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

const morganConfig = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    req.headers['content-length'],
    '-',
    tokens['response-time'](req, res),
    'ms',
    JSON.stringify(req.body),
  ].join(' ')
})
app.use(morganConfig)

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('-----')
  next()
}

app.use(requestLogger)

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello Sandesh</h1>')
})

app.get('/api/persons', (request, response) => {
  PhoneBook.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  PhoneBook.findById(request.params.id)
    .then((person) => {
      response.json(person)
    })
    .catch((error) => {
      response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  PhoneBook.findByIdAndRemove(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(400).json({ error: 'Person not found' })
      }
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new PhoneBook({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((formattedSavedPerson) => response.json(formattedSavedPerson))
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log(body)
  const phone = {
    name: body.name,
    number: body.number,
  }

  PhoneBook.findByIdAndUpdate(request.params.id, phone, {
    runValidators: true,
    new: true,
  })
    .then((updatedPhone) => {
      if (updatedPhone) {
        response.json(updatedPhone)
      } else {
        response.status(400).json({ error: 'Person not found' })
      }
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  const content = `Phonebook has info for ${
    persons.length
  } people <br><br> ${new Date().toString()}`
  response.send(content)
})

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndPoint)

const errorHandler = (error, request, response, next) => {
  console.log(error)

  switch (error.name.toLowerCase()) {
    case 'casterror':
      return response.status(400).json({ error: 'malformatted id' })
    case 'validationerror':
      return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`)
})
