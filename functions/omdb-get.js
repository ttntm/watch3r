const fetch = require('node-fetch')
const fnHeaders = require('./_shared/headers.js')

const key = process.env.VITE_APP_OMDB

exports.handler = async (event, context, callback) => {
  const claims = context.clientContext && context.clientContext.user
  const data = JSON.parse(event.body)

  console.log("Function `omdb-get` invoked", data)

  if (event.httpMethod !== 'POST') {
    return callback(null, {
      statusCode: 405,
      headers: { ...fnHeaders },
      body: 'Method Not Allowed'
    })
  } else if (!claims || !data) {
    return callback(null, {
      statusCode: 400,
      headers: { ...fnHeaders },
      body: 'Bad Request'
    })
  } else {
    try {
      const apiResponse = await fetch(`https://www.omdbapi.com/?${data.prefix}=${data.query}&apikey=${key}`, { method: 'GET' })
      const apiData = await apiResponse.json()

      return callback(null, {
        statusCode: 200,
        headers: { ...fnHeaders },
        body: JSON.stringify(apiData)
      })
    } catch (error) {
      console.log("error", error)

      return callback(null, {
        statusCode: 400,
        headers: { ...fnHeaders },
        body: JSON.stringify(error)
      })
    }
  }
}
