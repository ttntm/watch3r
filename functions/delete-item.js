const faunadb = require('faunadb');

function getList(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

exports.handler = (event, context, callback) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET
  });
  const q = faunadb.query;

  const data = JSON.parse(event.body);
  const id = data.item;
  const list = getList(event.path);

  console.log(`Function 'delete-item' invoked. delete id: ${id}`);

  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, body: 'Method Not Allowed'})
  } else if (!list || !id) {
    return callback(null, { statusCode: 400, body: 'Bad Request' })
  } else {
    return client.query(q.Delete(q.Ref(`collections/${list}/${id}`)))
      .then((response) => {
        console.log("success", response);
        return callback(null, { statusCode: 200, body: JSON.stringify(response) })
      }).catch((error) => {
        console.log("error", error);
        return callback(null, { statusCode: 400, body: JSON.stringify(error) })
      })
  }
}