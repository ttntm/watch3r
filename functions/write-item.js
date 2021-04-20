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
  const list = getList(event.path);
  const newEntry = {
    data: data
  };

  console.log(`Function 'write-item' invoked. ${newEntry}`);

  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, body: 'Method Not Allowed'})
  } else if (!list || !newEntry) {
    return callback(null, { statusCode: 400, body: 'Bad Request' })
  } else {
    return client.query(q.Create(q.Ref(`collections/${list}`), newEntry))
      .then((response) => {
        console.log("success", response);
        return callback(null, { statusCode: 200, body: JSON.stringify(response) })
      }).catch((error) => {
        console.log("error", error);
        return callback(null, { statusCode: 400, body: JSON.stringify(error) })
      })
  }
}