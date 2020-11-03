const faunadb = require('faunadb');

function getUsr(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET
});

exports.handler = (event, context, callback) => {
  const usr = getUsr(event.path);
  console.log("Function `read-tracklist` invoked");
  return client.query(q.Paginate(q.Match(q.Index('tracklist_user'), `${usr}`)))
    .then((response) => {
      const tracklistRefs = response.data;
      console.log("Tracklist refs", tracklistRefs);
      console.log(`${tracklistRefs.length} entries found`);
      // create new query out of tracklist refs. http://bit.ly/2LG3MLg
      const getTracklistDataQuery = tracklistRefs.map((ref) => {
        return q.Get(ref)
      })
      // then query the refs
      return client.query(getTracklistDataQuery).then((ret) => {
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify(ret)
        })
      })
    }).catch((error) => {
      console.log("error", error);
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}