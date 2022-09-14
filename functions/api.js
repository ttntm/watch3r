const api = require('./api-methods');
const fnHeaders = require('./_shared/headers.js')

// Returns [listname,userId]
const getMethodPath = evtPath => evtPath.match(/\w+\/([^\/]*)\/*$/)[0].split('/')

const getPath = urlPath => {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

const pathError = { statusCode: 500, headers: { ...fnHeaders }, body: 'No path specified' };

exports.handler = async (event, context) => {
  const claims = context.clientContext && context.clientContext.user;

  if (!claims) {
    return { statusCode: 401, headers: { ...fnHeaders }, body: 'NOT ALLOWED' }
  } else {
    const target = getPath(event.path);
    if (target) event.target = target;

    switch (event.httpMethod) {
      case 'GET':
        // Read from index based on userid
        [event.list, event.user] = getMethodPath(event.path)
        return event.list && event.user ? api.read(event, context) : pathError

      case 'POST':
        // target = listname
        return event.target ? api.create(event, context) : pathError

      case 'PUT':
        // Update item in collection based on itemid + payload
        [event.list, event.listItemId] = getMethodPath(event.path)
        return event.list && event.listItemId ? api.update(event, context) : pathError

      case 'DELETE':
        // Delete itemid from collection, collection = event.target, itemid = payload
        return event.target ? api.delete(event, context) : pathError

      default:
        return {
          statusCode: 500,
          headers: { ...fnHeaders },
          body: 'Unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE'
        }
    }
  }
}
