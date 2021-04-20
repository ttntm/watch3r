const date = require('date-and-time');
const faunadb = require('faunadb');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const lists = ['tracklist','watchlist'];
const now = new Date();

exports.handler = async (event, context, callback) => {
  const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
  const data = JSON.parse(event.body);
  const q = faunadb.query;

  // Define DB Queries
  const getIndexItemCount = async (indexName) => {
    const req = client.query(q.Count(q.Match(q.Index(`${indexName}`))));
    let response = await req;
    return response;
  }

  const getUserListSizes = async () => {
    const req = client.query(
      q.Map(
        q.Paginate(q.Match(q.Index('allUsersById'))),
        q.Lambda(
          ['userId'],
          q.Let(
            {
              tracklistRefs: q.Match(q.Index('tracklist_user'), q.Var('userId')),
              watchlistRefs: q.Match(q.Index('watchlist_user'), q.Var('userId')),
              tracklistCount: q.Count(q.Var('tracklistRefs')),
              watchlistCount: q.Count(q.Var('watchlistRefs')),
            },
            {
              User: q.Var('userId'),
              Tracklist: q.Var('tracklistCount'),
              Watchlist: q.Var('watchlistCount')
            }
          )
        )
      )
    );
    let response = await req; // returns a response like this: '{ data: Object[] }'
    return response.data;
  }

  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, body: 'Method Not Allowed'})
  } else if (!data.action || !data.grant === process.env.GRANT) {
    return callback(null, { statusCode: 400, body: 'Bad Request' })
  } else {
    try {
      // Setup Google Sheets
      // see: https://theoephraim.github.io/node-google-spreadsheet/#/?id=examples
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
      // authenticate as Service Account
      await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      });
      await doc.loadInfo(); // loads document properties and worksheets; required.
      // set up shared variables
      const dateVal = date.format(now, 'DD.MM.YYYY');
      let logger = [];
      const returnVal = () => callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Action: ${data.action}: Rows successfully added.`,
          rowsAdded: logger
        })
      });
      // add the query results to the sheet
      // DO NOT use 'lists.forEach()' here => see: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
      // if you do, unpredicatable things will happen and data will most likely never show up in Google Sheets due to 'await' calls never coming back after being triggered
      switch (data.action) {
        case 'indexSize':
          const listGrowthSheet = doc.sheetsByIndex[0];
          for (const listname of lists) {
            const addedRow = await listGrowthSheet.addRow({
              Date: dateVal,
              List: listname,
              ListItemCount: await getIndexItemCount(`${listname}_all`)
            });
            logger.push({ row: addedRow._rowNumber, data: addedRow._rawData });
          }
          return returnVal()

        case 'userListSize':
          const listSizeUserSheet = doc.sheetsByIndex[1];
          const userListSizes = await getUserListSizes();
          let len = userListSizes.length; // calculate length in advance so "...the array dereference is not necessary each iteration of the loop"; from: https://stackoverflow.com/a/17989524
          for (let i = 0; i < len; i++) {
            userListSizes[i].Date = dateVal;
            const addedRow = await listSizeUserSheet.addRow(userListSizes[i]);
            logger.push({ row: addedRow._rowNumber, data: addedRow._rawData });
          }
          return returnVal()

        default:
          return callback(null, { statusCode: 400, body: "Unknown action, aborting." })
      }
    } catch (error) {
      console.error(error);
      return callback(null, { statusCode: 400, body: JSON.stringify(error) })
    }
  }
}