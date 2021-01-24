const faunadb = require('faunadb');

function getUsr(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

exports.handler = (event, context, callback) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET
  });
  const q = faunadb.query;
  const usr = getUsr(event.path);

  console.log("Function `read-watchlist` invoked");

  return client.query(q.Paginate(q.Match(q.Index('watchlist_user'), `${usr}`)))
    .then((response) => {
      const watchlistRefs = response.data;
      console.log("Watchlist refs", watchlistRefs);
      console.log(`${watchlistRefs.length} entries found`);
      // create new query out of watchlist refs. http://bit.ly/2LG3MLg
      const getWatchlistDataQuery = watchlistRefs.map((ref) => {
        return q.Get(ref)
      });
      // then query the refs
      return client.query(getWatchlistDataQuery).then((ret) => {
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