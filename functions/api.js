const api = require('./api-methods');

const getPath = (urlPath) => {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

const pathError = { statusCode: 500, body: 'No path specified' };

exports.handler = async (event, context) => {
  const claims = context.clientContext && context.clientContext.user;

  if (!claims) {
    return { statusCode: 401, body: JSON.stringify({ data: 'NOT ALLOWED' }) }
  } else {
    const target = getPath(event.path);
    if (target) event.target = target;

    switch (event.httpMethod) {
      case 'GET':
        // need to treat the path differently here as GET requests can't have a request body
        const getPath = () => event.path.match(/\w+\/([^\/]*)\/*$/)[0].split('/'); // results in [listname,userId]
        [event.list, event.user] = getPath();
        return event.list && event.user ? api.read(event, context) : pathError

      case 'POST':
        // target = listname
        return event.target ? api.create(event, context) : pathError

      case 'PUT':
        // target = list item RefId
        return event.target ? api.update(event, context) : pathError

      case 'DELETE':
        // target = listname
        return event.target ? api.delete(event, context) : pathError

      default:
        return {
          statusCode: 500,
          body: 'unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE'
        }
    }
  }
}