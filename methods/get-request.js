const fsPromises = require('fs').promises

const handleOutput = (code, data, response) => {
  response.statusCode = code
  response.setHeader('Content-Type', 'application/json')
  response.write(JSON.stringify(data))
  response.end()
}

const handleDishList = async (request, response) => {
  handleOutput(200, request.dishes, response)
}

const handleDishItem = async (request, response) => {
  const id = request.url.split('/')[2]
  const dish = request.dishes.find((el) => el.id == id)
  if (dish) return handleOutput(200, dish, response)
  handleOutput(404, { message: 'There is no dish with such id' }, response)
}

const handleDishCategory = async (request, response) => {
  const selectedCategory = request.url.split('/')[3]
  const existingCategory = Array.from(new Set(request.dishes.map((element) => element.category)))
  let dishes = []
  if (existingCategory.includes(selectedCategory)) {
    dishes = request.dishes.filter((element) => element.category === selectedCategory)
    console.log(dishes)
  }
  if (dishes.length > 0) {
    handleOutput(200, dishes, response)
  } else {
    handleOutput(404, 'There is no such category', response)
  }
}

const endpointsHandler = {
  '/dishes/dish-list': handleDishList,
  '/dishes/\\d+': handleDishItem,
  '/dishes/category/([^/]+)': handleDishCategory,
}

const getReq = async (request, response) => {
  const wrapper = Object.keys(endpointsHandler).find((endpoint) => {
    const pattern = new RegExp(`^${endpoint}$`)
    return pattern.test(request.url)
  })

  if (wrapper) {
    endpointsHandler[wrapper](request, response)
  } else {
    handleOutput(404, { message: 'Invalid endpoint' }, response)
  }
}

module.exports = { getReq, handleOutput }
