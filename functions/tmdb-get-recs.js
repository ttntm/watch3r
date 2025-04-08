const fetch = require('node-fetch')
const fnHeaders = require('./_shared/headers.js')

const key = process.env.VITE_APP_TMDB

exports.handler = async (event, context, callback) => {
  const claims = context.clientContext && context.clientContext.user
  const data = JSON.parse(event.body)
  console.log("Function `tmdb-get-recs` invoked", data)

  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, headers: { ...fnHeaders }, body: 'Method Not Allowed'})
  } else if (!claims || !data) {
    return callback(null, { statusCode: 400, headers: { ...fnHeaders }, body: 'Bad Request' })
  } else {
    try {
      const titleResponse = await fetch(`https://api.themoviedb.org/3/find/${data.imdb_id}?api_key=${key}&external_source=imdb_id`, { method: 'GET' })
      const titleData = await titleResponse.json()

      if (titleData) {
        let recBaseID = 0
        const recType = data.type === 'series' ? 'tv' : data.type

        if (recType === 'movie') {
          recBaseID = titleData.movie_results[0].id
        } else {
          recBaseID = titleData.tv_results[0].id
        }

        try {
          const recResponse = await fetch(`https://api.themoviedb.org/3/${recType}/${recBaseID}/recommendations?api_key=${key}`, { method: 'GET' })
          const recData = await recResponse.json()
          return callback(null, { statusCode: 200, headers: { ...fnHeaders }, body: JSON.stringify(recData) })
        } catch {
          console.log("error", error)
          return callback(null, { statusCode: 400, headers: { ...fnHeaders }, body: JSON.stringify(error) })
        }
      }
    } catch (error) {
      console.log("error", error)
      return callback(null, { statusCode: 400, headers: { ...fnHeaders }, body: JSON.stringify(error) })
    }
  }
}