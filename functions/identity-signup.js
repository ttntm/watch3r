const fetch = require('node-fetch')
const fnHeaders = require('./_shared/headers.js')
const spb = require('@supabase/supabase-js')

exports.handler = async (event, context, callback) => {
  const rawNetlifyContext = context.clientContext.custom.netlify
  const netlifyContext = Buffer.from(rawNetlifyContext, 'base64').toString('utf-8')
  const { identity, user } = JSON.parse(netlifyContext)
  const debug = { i:identity, u: user }

  console.log(debug)

  return {
    statusCode: 200,
    headers: fnHeaders,
    body: JSON.stringify(debug)
  }

  // try {
  //   // get userlist
  //   const requestUL = await fetch(usersUrl, {
  //     method: 'GET',
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": adminAuthHeader,
  //     },
  //   })

  //   let responseUL = await requestUL.json()

  //   if (responseUL.users.length > 0) {
  //     const supabase = spb.createClient(process.env.SPB_URL, process.env.SPB_API_KEY, {
  //       auth: {
  //         autoRefreshToken: false,
  //         detectSessionInUrl: false,
  //         persistSession: false
  //       }
  //     })
  //     let userlistUpdate = []

  //     for (const user of responseUL.users) {
  //       if (user.confirmed_at) {
  //         userlistUpdate.push({
  //           id: user.id,
  //           email: user.email,
  //           created: user.confirmed_at
  //         })
  //       }
  //     }

  //     try {
  //       const { data, error } = await supabase
  //         .from('users')
  //         .upsert(userlistUpdate)
  //         .select()

  //         if (error) {
  //           throw JSON.stringify(error)
  //         }

  //         return {
  //           statusCode: 200,
  //           headers: fnHeaders,
  //           body: JSON.stringify({ message: 'Userlist updated' })
  //         }
  //     } catch (ex) {
  //       console.error(ex)

  //       return {
  //         statusCode: 400,
  //         headers: fnHeaders,
  //         body: typeof ex === 'string'
  //           ? ex
  //           : JSON.stringify(ex)
  //       }
  //     }
  //   } else {
  //     console.error(ex)

  //     return {
  //       statusCode: 400,
  //       headers: fnHeaders,
  //       body: 'Could not obtain userlist'
  //     }
  //   }
  // } catch (ex) {
  //   console.error(ex)

  //   return {
  //     statusCode: 400,
  //     headers: fnHeaders,
  //     body: typeof ex === 'string'
  //       ? ex
  //       : JSON.stringify(ex)
  //   }
  // }
}
