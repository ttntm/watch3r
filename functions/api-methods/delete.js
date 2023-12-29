const faunadb = require('faunadb')
const fnHeaders = require('../_shared/headers.js')

module.exports = (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET
  })
  const q = faunadb.query

  const data = JSON.parse(event.body)
  const id = data.item
  const list = event.target

  console.log(`Function 'delete' invoked. delete id: ${id}`)

  if (!list || !id) {
    return { statusCode: 400, body: 'Bad Request' }
  } else {
    return client.query(q.Delete(q.Ref(`collections/${list}/${id}`)))
      .then((response) => {
        console.log("success", response)
        return { statusCode: 200, headers: { ...fnHeaders },body: JSON.stringify(response) }
      }).catch((error) => {
        console.log("error", error)
        return { statusCode: 400, headers: { ...fnHeaders }, body: JSON.stringify(error) }
      })
  }
}