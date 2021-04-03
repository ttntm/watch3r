import { ref } from 'vue';
import store from '../store';

export const searchResult = ref({}); // displayed in ListAddModal.vue + Children

export const searchStatus = ref(''); // displayed in ListAddModal.vue

export async function getOMDB(api, requestData) {
  // called from ListAddModal.vue
  // using exact search here, i.e. only getting 0 or 1 result instead of a full list of results.
  const currentUser = store.getters['user/currentUser'];

  searchResult.value = {};
  searchStatus.value = `<img src="/img/loading.svg" class="mb-6 mx-auto">`;
  store.dispatch('list/toggleWriteSuccess', false); // reset previous write success (if any) for each search

  let response;

  try {
    const data = await fetch(api, { body: JSON.stringify(requestData), method: 'POST' });
    response = await data.json();
  } catch (err) {
    console.error('OMDB error: ', err);
    searchStatus.value = `
      <span class="text-red-600">
        API error - please try again later.
      </span>
    `;
  }

  if (response.Error) {
    searchStatus.value = response.Error; // response -> title not found
  } else {
    searchStatus.value = `
      <span class="text-sm block">
        Results provided by <a href="https://www.omdbapi.com" target="_blank" class="text-yellow-600 hover:text-black">OMDb API</a>
      </span>`;
    searchResult.value.genre = response.Genre;
    searchResult.value.id = response.imdbID;
    searchResult.value.image = response.Poster;
    searchResult.value.imdbRating = response.imdbRating;
    searchResult.value.plot = response.Plot;
    searchResult.value.title = response.Title;
    searchResult.value.type = response.Type;
    searchResult.value.user = currentUser.id,
    searchResult.value.year = response.Year;
  }
}