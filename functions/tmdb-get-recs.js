const fetch = require('node-fetch');

const key = process.env.VITE_APP_TMDB;

/* export our lambda function as named "handler" export */
exports.handler = async (event, context, callback) => {
  /* parse the string event.body into a useable JS object */
  const data = JSON.parse(event.body);
  console.log("Function `tmdb-get-recs` invoked", data);

  try {
    const titleResponse = await fetch(`https://api.themoviedb.org/3/find/${data.id}?api_key=${key}&external_source=imdb_id`, { method: 'GET' });
    const titleData = await titleResponse.json();

    if (titleData) {
      let recBaseID = 0;
      const recType = data.type === 'series' ? 'tv' : data.type;

      if (recType === 'movie') {
        recBaseID = titleData.movie_results[0].id;
      } else {
        recBaseID = titleData.tv_results[0].id;
      }

      try {
        const recResponse = await fetch(`https://api.themoviedb.org/3/${recType}/${recBaseID}/recommendations?api_key=${key}`, { method: 'GET' });
        const recData = await recResponse.json();
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify(recData)
        });
      } catch {
        console.log("error", error);
        return callback(null, {
          statusCode: 400,
          body: JSON.stringify(error)
        });
      }
    }
  } catch (error) {
    console.log("error", error);
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error)
    });
  }
}