module.exports = async (request) => {
  return new Promise((resolve, rejected) => {
    try {
      let body = ''
      request.on('data', (chunk) => {
        body += chunk
      })
      request.on('end', () => {
        resolve(JSON.parse(body))
      })
    } catch (err) {
      console.error(err)
      rejected(err)
    }
  })
}
