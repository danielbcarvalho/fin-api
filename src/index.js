const express = require('express');
const { v4: uuid } = require('uuid');

const app = express();

//receber JSON
app.use(express.json());

const customers = [];

// Middleware
function verifyIfExistsAccount(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: 'Customer not found'} );
  }

  request.customer = customer;

  return next();
}

function getBalance(statement) {
  const balance = statement.reduce((accumulator, statement) => {
    if (statement.type === 'credit') {
      return accumulator + statement.amount
    }
    return accumulator - statement.amount
  }, 0)

  return balance
}

app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  const userAlreadyExists = customers.some((customer) => 
    customer.cpf === cpf
  )

  if(userAlreadyExists) {
    return response.status(400).json({error: 'User already exists'});
  }

  customers.push({
    cpf,
    name,
    id: uuid(),
    statement: [],
  })

  return response.json(customers)
})

// utiliza o middleware em todas as rotas abaixo
app.use(verifyIfExistsAccount)

//utiliza o middleware na rota específica
app.get('/statement', verifyIfExistsAccount, (request, response) => {
  const { customer } = request

  return response.json(customer.statement)
})

app.get('/statement/date', verifyIfExistsAccount, (request, response) => {
  const { customer } = request

  const { date } = request.query

  const dateFormat = new Date(date + ' 00:00')

  const statement = customer.statement.filter(
    (statement) => 
      statement.created_at.toDateString() === dateFormat.toDateString()
    )

  return response.json(statement)
})

app.post('/deposit', verifyIfExistsAccount, (request, response) => {
  const { customer } = request

  const { description, amount } = request.body

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit'
  }

  customer.statement.push(statementOperation)
  console.log("🚀 ~ file: index.js ~ line 71 ~ app.post ~ statementOperation", statementOperation)

  return response.status(201).send()
})

app.post('/withdraw', (request, response) => {
  const { customer } = request

  const { description, amount } = request.body

  const balance = getBalance(customer.statement)

  if(amount > balance) {
    return response.status(400).json({ error: 'Insufficient funds!'})
  }

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'debit'
  }

  customer.statement.push(statementOperation)

  return response.status(201).send()
})

app.put('/account', (request, response) => {
  const { customer } = request
  const { name } = request.body

  customer.name = name

  return response.status(201).send()
})

app.get('/account', (request, response) => {
  const { customer } = request

  response.json(customer)
})

app.delete('/account', (request, response) => {
  const { customer } = request

  // splice + indexOf pega a posição do array customer e exclui uma posição a mais
  customers.splice(customers.indexOf(customer), 1)

  response.status(200).json(customers)
})

//localhost:33333
app.listen(3333, () => console.log('Server running'))