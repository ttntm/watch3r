const date = require('date-and-time');
const faunadb = require('faunadb');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const lists = ['tracklist','watchlist'];

exports.handler = async (event, context, callback) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET
  });
  const q = faunadb.query;

  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, body: 'Method Not Allowed'})
  } else {
    try {
      // STEP 1: query the database for the necessary data
      const getIndexItemCount = async (indexName) => {
        const req = client.query(q.Count(q.Paginate(q.Match(q.Index(`${indexName}`)), { size: 10000 })));
        let response = await req;
        return response.data[0];
      }
      // STEP 2: write into Google Sheets for tracking
      // see: https://theoephraim.github.io/node-google-spreadsheet/#/?id=examples
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
      // authenticate
      await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      });
      // initialize sheet
      await doc.loadInfo(); // loads document properties and worksheets; required.
      const sheet = doc.sheetsByIndex[0]; // use the first sheet
      // add the query results to the sheet
      const now = new Date();
      // DO NOT use 'lists.forEach()' here => see: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
      // if you do, unpredicatable things will happen and data will most likely never show up in Google Sheets due to 'await' calls never coming back after being triggered
      for (const listname of lists) {
        const addedRow = await sheet.addRow({
          Date: date.format(now, 'DD.MM.YYYY'),
          List: listname,
          ListItemCount: await getIndexItemCount(`${listname}_all`)
        });
        console.log(addedRow._rowNumber, addedRow._rawData); // visible in Netlify's funcion logs
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `POST Success - added rows`
        })
      };
    } catch (error) {
      console.error(error);
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      });
    }
  }
}