require('dotenv').config()
const http = require('http')

const { getReq } = require('./methods/get-request')
const putReq = require('./methods/put-request')
const deleteReq = require('./methods/delete-request')
const postReq = require('./methods/post-request')

const PORT = process.env.PORT
let dishes = require('./data/dishes.json')

const server = http.createServer((request, response) => {
  request.dishes = dishes
  switch (request.method) {
    case 'GET':
      getReq(request, response)
      break
    case 'POST':
      postReq(request, response)
      break
    case 'PUT':
      putReq(request, response)
      break
    case 'DELETE':
      deleteReq(request, response)
      break
    default:
      response.statusCode = 404
      response.setHeader('Content-Type', 'application/json')
      response.write(JSON.stringify({ message: 'There is no such endpoint' }))
      response.end()
  }
})

server.listen(PORT, () => {
  console.log(`Server started on port:`, PORT)
})
