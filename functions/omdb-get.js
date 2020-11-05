const fetch = require('node-fetch');

const key = process.env.VUE_APP_OMDB;

/* export our lambda function as named "handler" export */
exports.handler = async (event, context, callback) => {
  /* parse the string event.body into a useable JS object */
  const data = JSON.parse(event.body);
  console.log("Function `omdb-get` invoked", data);

  try {
    const apiResponse = await fetch(`https://www.omdbapi.com/?${data.prefix}=${data.query}&apikey=${key}`, { method: 'GET' });
    const apiData = await apiResponse.json();
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(apiData)
    });
  } catch (error) {
    console.log("error", error);
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error)
    });
  }
}