const faunadb = require('faunadb');

function getId(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

exports.handler = (event, context, callback) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET
  });
  const data = JSON.parse(event.body);
  const id = getId(event.path);
  const q = faunadb.query;

  console.log(`Function 'update-tracklist' invoked. update id: ${id}`);

  return client.query(q.Update(q.Ref(`collections/tracklist/${id}`), {data}))
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