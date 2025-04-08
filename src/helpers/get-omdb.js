import { ref } from 'vue'
import store from '@/store/index.js'
import { getAuthHeaders } from '@/helpers/shared.js'

export const searchResult = ref({}) // displayed in ListAddModal.vue + Children

export const searchStatus = ref('') // displayed in ListAddModal.vue

export async function getOMDB(api, requestData) {
  // called from ListAddModal.vue
  // using exact search here, i.e. only getting 0 or 1 result instead of a full list of results.
  const currentUser = store.getters['user/currentUser']

  searchResult.value = {}
  searchStatus.value = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="mb-6 mx-auto" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#d69e2e" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round" transform="rotate(123.903 50 50)">
      <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
    </circle>
  </svg>`

  store.dispatch('list/toggleWriteSuccess', false) // reset previous write success (if any) for each search

  let response

  try {
    const reqHeaders = await getAuthHeaders()
    const data = await fetch(api, {
      body: JSON.stringify(requestData),
      method: 'POST',
      headers: reqHeaders
    })

    response = await data.json()
  } catch (err) {
    console.error('OMDB error: ', err)

    searchStatus.value = `<span class="text-red-600">
      API error - please try again later.
    </span>`
  }

  if (response.Error) {
    searchStatus.value = response.Error // response -> title not found
  } else {
    searchStatus.value = `<span class="text-sm block">
      Results provided by <a href="https://www.omdbapi.com" target="_blank" class="text-yellow-600 hover:text-black">OMDb API</a>
    </span>`
    searchResult.value.genre = response.Genre
    searchResult.value.imdb_id = response.imdbID
    searchResult.value.image = response.Poster
    searchResult.value.imdb_rating = response.imdbRating
    searchResult.value.plot = response.Plot
    searchResult.value.title = response.Title
    searchResult.value.type = response.Type
    searchResult.value.user = currentUser.id
    searchResult.value.year = response.Year
  }
}
