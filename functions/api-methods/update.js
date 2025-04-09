const fnHeaders = require('../_shared/headers.js')
const spb = require('@supabase/supabase-js')

module.exports = async (event, context) => {
  const { body, list, listItemId } = event
  const headers = { ...fnHeaders }
  const origin = event.headers.Origin || event.headers.origin
  const supabase = spb.createClient(process.env.SPB_URL, process.env.SPB_API_KEY, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  })
  const update = JSON.parse(body)

  headers['Access-Control-Allow-Origin'] = origin ? origin : '*'

  console.log(`Function 'update' invoked. update id: ${listItemId}`)

  if (!update || !list) {
    return {
      statusCode: 400,
      headers: { ...fnHeaders },
      body: 'Bad Request'
    }
  } else {
    try {
      const { data, error } = await supabase
        .from(list)
        .update(update)
        .eq('id', listItemId)
        .select()

      if (error) {
        throw JSON.stringify(error)
      }

      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(data)
      }
    } catch (ex) {
      console.error(ex)

      return {
        statusCode: 400,
        headers: headers,
        body: typeof ex === 'string'
          ? ex
          : JSON.stringify(ex)
      }
    }
  }
}
