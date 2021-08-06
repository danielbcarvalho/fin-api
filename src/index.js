const { request, response } = require('express');
const express  = require('express');

const app = express();

//receber JSON
app.use(express.json());

app.get('/courses', (request, response) => {
  const query = request.query;
  console.log(query);
  return response.json(["Curso 1", "Curso 2", "Curso 3",]);
})

app.post('/courses', (request, response) => {
  const body = request.body;
  console.log("🚀 ~ file: index.js ~ line 14 ~ app.post ~ body", body)
  
  return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
})

app.put('/courses/:id', (request, response) => {
  const params = request.params;
  console.log(params);
  return response.json(["Curso Novo", "Curso 2", "Curso 3", "Curso 4"]);
})

app.patch('/courses/:id', (request, response) => {
  return response.json(["Curso Novo", "Curso Novo 2", "Curso 3", "Curso 4"]);
})

app.delete('/courses/:id', (request, response) => {
  return response.json(["Curso Novo", "Curso Novo 2", "Curso 4"]);
})

//localhost:33333
app.listen(3333)