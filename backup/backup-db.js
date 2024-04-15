const config = require('dotenv').config()
const faunadb = require('faunadb')
const fs = require('fs')
const q = faunadb.query

async function getData(indexName, size) {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
    domain: 'db.us.fauna.com'
  })

  try {
    return client.query(
      q.Paginate(
        q.Match(
          q.Index(indexName)
        ),
        { size: size }
      )
    )
      .then(async (response) => {
        const listRefs = response.data

        console.log(`INFO | Index: ${indexName} | ${listRefs.length} entries found`)

        const getListDataQuery = listRefs.map(ref => q.Get(ref))
        const records = await client.query(getListDataQuery)
        return records
      })
      .catch((error) => {
        throw error
      })
  } catch (ex) {
    console.error(ex.message || ex)
  }
}

function getTimestamp() {
  const d = new Date()
  return d.toISOString().split('T')[0].replaceAll('-', '')
}

async function main() {
  const config = {
    indexList: [
      'tracklist_all',
      'watchlist_all',
      'users_all'
    ],
    size: 500
  }

  for (let i = 0; i < config.indexList.length; i++) {
    try {
      const currentIndex = config.indexList[i]

      const data = await getData(currentIndex, config.size)

      if (data) {
        const now = getTimestamp()
        const output = JSON.stringify(data, null, 2)

        await fs.promises.writeFile(`./backup/${now}-${currentIndex}.json`, output)
      }
    } catch (ex) {
      console.error(ex.message || ex)
    }
  }
}

main()
