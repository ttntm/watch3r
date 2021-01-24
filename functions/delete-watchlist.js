const faunadb = require('faunadb');

function getId(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

exports.handler = (event, context, callback) => {
  const id = getId(event.path);
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET
  });
  const q = faunadb.query;

  console.log(`Function 'delete-watchlist' invoked. delete id: ${id}`);

  return client.query(q.Delete(q.Ref(`collections/watchlist/${id}`)))
    .then((response) => {
      console.log("success", response);
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response)
      })
    }).catch((error) => {
      console.log("error", error);
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}