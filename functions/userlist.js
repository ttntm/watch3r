const fetch = require('node-fetch');

exports.handler = async (event, context, callback) => {
  const { identity } = context.clientContext;
  const usersUrl = `https://watch3r.app/.netlify/identity/admin/users`;
  const adminAuthHeader = `Bearer ${identity.token}`;

  try {
    return fetch(usersUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": adminAuthHeader,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify(data)
        });
      })
      .catch((e) => {
        return {
          statusCode: 500,
          body: 'Internal Server Error: ' + e,
        };
      });
  } catch (e) {
    return e;
  }
};