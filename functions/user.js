const fnHeaders = require('./_shared/headers.js')
const spb = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  console.log("Function 'user' invoked")

  switch(event.httpMethod) {
    case 'POST':
      const { body } = event
      // from `setLastLogin()`: { id: string, last_login: date(ISO string) }
      const userData = JSON.parse(body)

      try {
        const supabase = spb.createClient(process.env.SPB_URL, process.env.SPB_API_KEY, {
          auth: {
            autoRefreshToken: false,
            detectSessionInUrl: false,
            persistSession: false
          }
        })
        const { data, error } = await supabase
          .from('users')
          .upsert(userData)

        if (error) {
          throw JSON.stringify(error)
        }

        return {
          statusCode: 200,
          headers: fnHeaders,
          body: JSON.stringify({ message: 'User updated' })
        }
      } catch (ex) {
        console.error(ex)

        return {
          statusCode: 400,
          headers: fnHeaders,
          body: typeof ex === 'string'
            ? ex
            : JSON.stringify(ex)
        }
      }

    default:
      return {
        statusCode: 500,
        headers: { ...fnHeaders },
        body: 'Unrecognized HTTP Method'
      }
  }
}
