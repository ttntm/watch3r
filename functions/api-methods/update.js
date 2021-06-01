const faunadb = require('faunadb');
const fnHeaders = require('../_shared/headers.js');

module.exports = (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET
  });
  const q = faunadb.query;

  const data = JSON.parse(event.body);
  const id = event.target;

  console.log(`Function 'update' invoked. update id: ${id}`);

  if (!data || !id) {
    return { statusCode: 400, headers: { ...fnHeaders }, body: 'Bad Request' }
  } else {
    return client.query(q.Update(q.Ref(`collections/tracklist/${id}`), {data}))
      .then((response) => {
        console.log("success", response);
        return { statusCode: 200, headers: { ...fnHeaders }, body: JSON.stringify(response) }
      }).catch((error) => {
        console.log("error", error);
        return { statusCode: 400, headers: { ...fnHeaders }, body: JSON.stringify(error) }
      })
  }
}