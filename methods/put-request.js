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
        request.dishes[body.id] = body
        writeFile(request.dishes)
        handleOutput(200, JSON.stringify(request.dishes[body.id]), response)
      } else {
        handleOutput(400, JSON.stringify({ message: 'Provided object has wrong pattern' }), response)
      }
    } catch (e) {
      handleOutput(400, JSON.stringify({ message: 'The provided url was incorrect.' }), response)
    }
  }
}
