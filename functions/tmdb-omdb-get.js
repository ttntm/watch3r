const fetch = require('node-fetch');

const oKey = process.env.VITE_APP_OMDB;
const tKey = process.env.VITE_APP_TMDB;

exports.handler = async (event, context, callback) => {
  const claims = context.clientContext && context.clientContext.user;
  const data = JSON.parse(event.body);
  console.log("Function `tmdb-omdb-get` invoked", data);

  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, body: 'Method Not Allowed'})
  } else if (!claims || !data) {
    return callback(null, { statusCode: 400, body: 'Bad Request' })
  } else {
    try {
      const type = data.type === 'series' ? 'tv' : data.type;
      const tmdbResponse = await fetch(`https://api.themoviedb.org/3/${type}/${data.id}/external_ids?api_key=${tKey}`, { method: 'GET' });
      const tmdbData = await tmdbResponse.json();

      if (tmdbData) {
        try {
          const omdbResponse = await fetch(`https://www.omdbapi.com/?i=${tmdbData.imdb_id}&apikey=${oKey}`, { method: 'GET' });
          const omdbData = await omdbResponse.json();
          return callback(null, { statusCode: 200, body: JSON.stringify(omdbData) })
        } catch {
          console.log("error", error);
          return callback(null, { statusCode: 400, body: JSON.stringify(error) })
        }
      }
    } catch (error) {
      console.log("error", error);
      return callback(null, { statusCode: 400, body: JSON.stringify(error) })
    }
  }
}