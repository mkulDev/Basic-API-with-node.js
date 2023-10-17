const parser = require('../utils/parser.js')
const { handleOutput } = require('./get-request')
const writeFile = require('../utils/writeFile.js')

module.exports = async (request, response) => {
  if (request.url !== '/dishes/')
    return handleOutput(400, JSON.stringify({ message: 'The provided url was incorrect.' }), response)
  try {
    const body = await parser(request)
    if (!(typeof body.id === 'number' && Number.isInteger(body.id) && body.id >= 1 && body.id <= request.dishes.length))
      return handleOutput(400, JSON.stringify({ message: 'The provided id was incorrect.' }), response)
    const newDishList = request.dishes
      .filter((element) => element.id !== body.id)
      .map((element, index) => ({ ...element, id: index + 1 }))
    writeFile(newDishList)
    handleOutput(200, { message: 'The object with the provided ID was deleted.' }, response)
  } catch (e) {
    handleOutput(400, JSON.stringify({ message: e.message }), response)
  }
}
