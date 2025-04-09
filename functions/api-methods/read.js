const fnHeaders = require('../_shared/headers.js')
const spb = require('@supabase/supabase-js')

module.exports = async (event, context) => {
  console.log("Function 'read' invoked")

  const { list, user } = event
  const headers = { ...fnHeaders }
  const origin = event.headers.Origin || event.headers.origin
  const supabase = spb.createClient(process.env.SPB_URL, process.env.SPB_API_KEY)

  headers['Access-Control-Allow-Origin'] = origin ? origin : '*'

  try {
    const { data, error } = await supabase
      .from(`${list}`)
      .select()
      .eq('user_id', user)
      .order('created', { ascending: false })

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
