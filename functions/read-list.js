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
  const user = data.user;

  console.log("Function 'read-list' invoked");

  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, body: 'Method Not Allowed'})
  } else if (!list || !user) {
    return callback(null, { statusCode: 400, body: 'Bad Request' })
  } else {
    return client.query(q.Paginate(q.Match(q.Index(`${list}_user`), `${user}`), { size: 500 }))
      .then((response) => {
        const listRefs = response.data;
        console.log("List refs", listRefs);
        console.log(`${listRefs.length} entries found`);
        // create new query out of tracklist refs. http://bit.ly/2LG3MLg
        const getListDataQuery = listRefs.map((ref) => {
          return q.Get(ref)
        })
        // then query the refs
        return client.query(getListDataQuery).then((ret) => {
          return callback(null, { statusCode: 200, body: JSON.stringify(ret) })
        })
      }).catch((error) => {
        console.log("error", error);
        return callback(null, { statusCode: 400, body: JSON.stringify(error) })
      })
  }
}