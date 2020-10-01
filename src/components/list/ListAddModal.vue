<template>
  <div class="list-add-modal" v-click-outside="closeModal">
    <div class="flex flex-row justify-between items-center px-8">
      <h3 class="text-gray-600 text-base mb-0">Add Title to <span class="capitalize">{{ mode }}</span></h3>
      <button
        @click.prevent="closeModal()"
        class="font-bold text-gray-800 text-xl opacity-75 cursor-pointer hover:opacity-100 focus:outline-none"
      >×</button>
    </div>
    <div class="text-gray-600">
      <InputSearch @do-search="doSearch($event)" :autofocus="true" pch="Movie title, series" class="px-8 py-6" />
      <ListAddSearchResult v-if="searchResult.id" :mode="mode" :searchResult="searchResult" class="px-8" />
      <p v-if="searchStatus" v-html="searchStatus" class="px-8 py-4 mb-0" />
    </div>
  </div>
</template>

<script>
import InputSearch from '@/components/InputSearch.vue';
import ListAddSearchResult from '@/components/list/ListAddSearchResult.vue';
import {computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListAddModal',
  components: {
    InputSearch,
    ListAddSearchResult
  },
  props: {
    mode: String
  },
  setup(props) {
    const store = useStore();

    const currentUser = computed(() => store.getters['user/currentUser']);
    const searchResult = ref({});
    const searchStatus = ref('');
    const spinner = require('@/assets/loading.svg');

    const closeModal = () => {
      store.dispatch('list/toggleAddTitleModal', false);
      store.dispatch('list/toggleWriteSuccess', false); // reset previous write success (if any) when closing this modal
    };

    const doSearch = (val) => {
      const key = process.env.VUE_APP_OMDB;

      searchResult.value = {};
      searchStatus.value = `<img src="${spinner}" class="mx-auto">`;
      store.dispatch('list/toggleWriteSuccess', false); // reset previous write success (if any) for each search

      fetch(`https://www.omdbapi.com/?t=${val}&apikey=${key}`, {
        method: 'POST',
        // header: {
        //   'Access-Control-Allow-Origin': '*'
        // },
        // mode: 'cors',
      })
        .then(response => {
          return response.json();
        })
        .then(res => {
          if(res.Error) {
            // response -> title not found
            searchStatus.value = res.Error;
          } else {
            searchStatus.value = '';
            searchResult.value.genre = res.Genre;
            searchResult.value.id = res.imdbID;
            searchResult.value.image = res.Poster;
            searchResult.value.imdbRating = res.imdbRating;
            searchResult.value.plot = res.Plot;
            searchResult.value.title = res.Title;
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

    return {
      closeModal,
      doSearch,
      searchResult,
      searchStatus
    }
  }
}
</script>

<style lang="postcss" scoped>
  .list-add-modal {
    @apply fixed top-0 left-0 right-0 z-20 bg-gray-200 rounded-lg shadow-lg mt-12 mx-auto py-6;
    width: calc(100% - 2rem);
  }
  @media(min-width:768px) {
    .list-add-modal {
      @apply w-2/3;
    }
  }
  @media(min-width:1024px) {
    .list-add-modal {
      @apply w-1/2 mt-0;
      top: 175px;
    }
  }
  @media(min-width:1440px) {
    .list-add-modal {
      @apply max-w-xl;
    }
  }
</style>