const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PORT = 3001
const app = express()

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

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello Sandesh</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((p) => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((p) => p.id === id)

  if (person) {
    persons = persons.filter((p) => p.id !== id)
    response.status(204).end()
  } else {
    response.status(400).json({ error: 'person not found' })
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  if (persons.find((p) => p.name.toLowerCase() === body.name.toLowerCase())) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.status(200).end()
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

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`)
})
