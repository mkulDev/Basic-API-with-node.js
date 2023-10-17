const parser = require('../utils/parser.js')
const writeFile = require('../utils/writeFile.js')
const { handleOutput } = require('./get-request')

const expectedFields = {
  id: 'number',
  name: 'string',
  category: 'string',
  ingredients: 'object',
  timeToPrepare: 'string',
}

module.exports = async (request, response) => {
  if (request.url === '/dishes/') {
    try {
      const body = await parser(request)
      const hasExpectedPatern = Object.keys(expectedFields).every((field) => {
        return body.hasOwnProperty(field) && typeof body[field] === expectedFields[field]
      })
      if (hasExpectedPatern) {
        body.id = request.dishes.length + 1
        request.dishes.push(body)
        console.log(request.dishes)
        writeFile(request.dishes)
        handleOutput(200, { message: 'The provided object was added successfully.' }, response)
      } else {
        handleOutput(400, { message: 'The pattern of the provided object is incorrect.' }, response)
      }
    } catch (e) {
      handleOutput(400, JSON.stringify({ message: 'The provided url was incorrect.' }), response)
    }
  }
}
