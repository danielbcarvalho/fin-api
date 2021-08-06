const express = require('express');
const { v4: uuid } = require('uuid');

const app = express();

const customers = [];

//receber JSON
app.use(express.json());

app.post('/account', (request, response) => {
  const { taxIdentifier, name } = request.body;

  const userAlreadyExists = customers.some((customer) => 
    customer.taxIdentifier === taxIdentifier
  )

  if(userAlreadyExists) {
    return response.status(400).json({error: 'User already exists'});
  }

  customers.push({
    taxIdentifier,
    name,
    id: uuid(),
    statement: [],
  })

  return response.json(customers)
})

app.get('/statement', (request, response) => {
  const { id } = request.headers;
  console.log("🚀 ~ file: index.js ~ line 34 ~ app.get ~ id", id)

  const customer = customers.find((customer) => customer.id === id);

  if (!customer) {
    return response.status(400).json({ error: 'Usuário não localizado'} );
  }

  return response.json(customer.statement);
})

//localhost:33333
app.listen(3333, () => console.log('Server running'))