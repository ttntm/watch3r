const faunadb = require('faunadb')
const fnHeaders = require('../_shared/headers.js')

module.exports = (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET
  })
  const q = faunadb.query

  const { list, user } = event

  console.log("Function 'read' invoked")

  if (!list || !user) {
    return { statusCode: 400, headers: { ...fnHeaders }, body: 'Bad Request' }
  } else {
    return client.query(q.Paginate(q.Match(q.Index(`${list}_user`), `${user}`), { size: 500 }))
      .then((response) => {
        const listRefs = response.data
        console.log("List refs", listRefs)
        console.log(`${listRefs.length} entries found`)
        // create new query out of list refs. http://bit.ly/2LG3MLg
        const getListDataQuery = listRefs.map(ref => q.Get(ref))
        // then query the refs
        return client.query(getListDataQuery).then((ret) => {
          return { statusCode: 200, headers: { ...fnHeaders }, body: JSON.stringify(ret) }
        })
      }).catch((error) => {
        console.log("error", error)
        return { statusCode: 400, headers: { ...fnHeaders }, body: JSON.stringify(error) }
      })
  }
}