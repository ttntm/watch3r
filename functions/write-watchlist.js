const faunadb = require('faunadb');

/* export our lambda function as named "handler" export */
exports.handler = (event, context, callback) => {
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET
  });
  const q = faunadb.query;

  /* parse the string body into a useable JS object */
  const data = JSON.parse(event.body);
  const newEntry = {
    data: data
  };

  console.log("Function `write-watchlist` invoked", data);

  /* construct the fauna query */
  return client.query(q.Create(q.Ref("collections/watchlist"), newEntry))
    .then((response) => {
      console.log("success", response);
      /* Success! return the response with statusCode 200 */
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response)
      })
    }).catch((error) => {
      console.log("error", error);
      /* Error! return the error with statusCode 400 */
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}