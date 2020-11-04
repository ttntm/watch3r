<template>
  <section class="list-modal text-gray-600" role="dialog" aria-labelledby="add-modal-heading" v-click-outside="closeModal" v-esc="closeModal" v-scroll-lock>
    <section class="flex flex-row justify-between items-center px-8">
      <h3 id="add-modal-heading" class="text-base mb-0">Add Title to <span class="capitalize">{{ mode }}</span></h3>
      <button
        @click.prevent="closeModal()"
        class="font-bold text-gray-800 text-xl opacity-75 cursor-pointer hover:opacity-100 focus:outline-none"
        title="Close"
      >×</button>
    </section>
    <section class="px-8 py-6">
      <InputSearch @do-search="doSearch($event)" :autofocus="true" pch="Title or IMDb ID" />
      <div class="flex flex-row items-center text-sm mt-4">
        <span class="font-bold mr-2">Mode:</span>
        <InputRadio class="mr-4" name="search-mode" :label="'title'" :value="searchMode" @update:radio="updateSearchMode($event)" />
        <InputRadio class="" name="search-mode" :label="'id'" :value="searchMode" @update:radio="updateSearchMode($event)" />
      </div>
    </section>
    <ListAddSearchResult v-if="searchResult.id" :mode="mode" :searchResult="searchResult" class="px-8" />
    <p v-if="searchStatus" v-html="searchStatus" class="text-center px-8 py-4 mb-0" />
  </section>
</template>

<script>
import InputRadio from '@/components/input/InputRadio.vue';
import InputSearch from '@/components/input/InputSearch.vue';
import ListAddSearchResult from '@/components/list/ListAddSearchResult.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListAddModal',
  components: {
    InputRadio,
    InputSearch,
    ListAddSearchResult
  },
  props: {
    mode: String
  },
  setup(props) {
    const store = useStore();

    const currentUser = computed(() => store.getters['user/currentUser']);
    const searchMode = ref('title');
    const searchResult = ref({});
    const searchStatus = ref('');
    const spinner = require('@/assets/loading.svg');

    const closeModal = () => {
      store.dispatch('app/toggleWindow', 0);
      store.dispatch('list/toggleWriteSuccess', false); // reset previous write success (if any) when closing this modal
    }

    const doSearch = (val) => {
      // using exact search here, i.e. only getting 0 or 1 result instead of a full list of results.
      const fn = store.getters['app/functions'];
      const searchQuery = {
        prefix: searchMode.value === 'title' ? 't' : 'i', // see: https://www.omdbapi.com/#parameters
        query: val
      }

      searchResult.value = {};
      searchStatus.value = `<img src="${spinner}" class="mx-auto">`;
      store.dispatch('list/toggleWriteSuccess', false); // reset previous write success (if any) for each search

      fetch(fn.omdbGet, { body: JSON.stringify(searchQuery), method: 'POST' })
        .then(response => {
          return response.json();
        })
        .then(res => {
          if(res.Error) {
            searchStatus.value = res.Error; // response -> title not found
          } else {
            searchStatus.value = `
              <span class="text-sm block pt-4">
                Results provided by <a href="https://www.omdbapi.com" target="_blank" class="text-yellow-600 hover:text-black">OMDb API</a>
              </span>`;
            searchResult.value.genre = res.Genre;
            searchResult.value.id = res.imdbID;
            searchResult.value.image = res.Poster;
            searchResult.value.imdbRating = res.imdbRating;
            searchResult.value.plot = res.Plot;
            searchResult.value.title = res.Title;
            searchResult.value.type = res.Type;
            searchResult.value.user = currentUser.value.email,
            searchResult.value.year = res.Year;
          }
        })
        .catch((error) => {
          console.log("OMDB API error", error);
          searchStatus.value = `
            <span class="text-red-600">
              API error - please try again later.
            </span>
          `;
        })
    }

    const updateSearchMode = (m) => { searchMode.value = m; }

    return {
      closeModal,
      doSearch,
      searchMode,
      searchResult,
      searchStatus,
      updateSearchMode
    }
  }
}
</script>