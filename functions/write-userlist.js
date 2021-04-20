const faunadb = require('faunadb');
const fetch = require('node-fetch');

exports.handler = async (event, context, callback) => {
  const { identity } = context.clientContext;
  const adminAuthHeader = `Bearer ${identity.token}`;
  const data = JSON.parse(event.body);
  const usersUrl = `${identity.url}/admin/users`;

  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, body: 'Method Not Allowed'})
  } else if (!data.grant === process.env.USERLIST) {
    return callback(null, { statusCode: 400, body: 'Bad Request' })
  } else {
    try {
      // get userlist
      const requestUL = await fetch(usersUrl, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": adminAuthHeader,
        },
      });

      let responseUL = await requestUL.json();

      if (responseUL.users.length > 0) {
        let userlistPayload = []
        for (const user of responseUL.users) {
          if (user.confirmed_at) {
            userlistPayload.push(
              {
                data: {
                  id: user.id,
                  email: user.email,
                  created: user.confirmed_at
                }
              }
            );
          }
        }

        try {
          const client = new faunadb.Client({
            secret: process.env.FAUNA_SECRET
          });
          const q = faunadb.query;

          let upsert = await client.query(q.Map(
            userlistPayload,
            q.Lambda(
              ['d'],
              q.If(
                q.Exists(
                  q.Match(
                    q.Index('userId'),
                    q.Select(['data', 'id'], q.Var('d'))
                  )
                ),
                q.Replace(
                  q.Select(
                    'ref',
                    q.Get(
                      q.Match(
                        q.Index('userId'),
                        q.Select(['data', 'id'], q.Var('d'))
                      )
                    )
                  ),
                  q.Var('d')
                ),
                q.Create(q.Collection('users'), q.Var('d'))
              )
            )
          ));

          console.log(upsert);
          return callback(null, { statusCode: 200, body: JSON.stringify({ message: "Userlist updated", response: upsert }) })
        } catch (error) {
          console.error(error);
          return callback(null, { statusCode: 400, body: JSON.stringify(error) })
        }
      } else {
        return callback(null, { statusCode: 400, body: 'Could not obtain userlist' })
      }
    } catch (error) {
      console.error(error);
      return callback(null, { statusCode: 400, body: JSON.stringify(error) })
    }
  }
}