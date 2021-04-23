const faunadb = require('faunadb');

module.exports = (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET
  });
  const data = JSON.parse(event.body);
  const id = event.target;
  const q = faunadb.query;

  console.log(`Function 'update' invoked. update id: ${id}`);

  if (!data || !id) {
    return { statusCode: 400, body: 'Bad Request' }
  } else {
    return client.query(q.Update(q.Ref(`collections/tracklist/${id}`), {data}))
      .then((response) => {
        console.log("success", response);
        return { statusCode: 200, body: JSON.stringify(response) }
      }).catch((error) => {
        console.log("error", error);
        return { statusCode: 400, body: JSON.stringify(error) }
      })
  }
}