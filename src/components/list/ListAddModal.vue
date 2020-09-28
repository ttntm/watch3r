<template>
  <div v-if="modalOpen" class="list-add-modal" v-click-outside="closeModal">
    <div class="flex flex-row justify-between items-center px-8">
      <h3 class="text-gray-600 text-base mb-0">Add Title to <span class="capitalize">{{ mode }}</span></h3>
      <button
        @click.prevent="closeModal()"
        class="font-bold text-gray-800 text-xl opacity-75 cursor-pointer hover:opacity-100 focus:outline-none"
      >×</button>
    </div>
    <div class="text-gray-600">
      <InputSearch @do-search="doSearch($event)" class="px-8 py-6" />
      <p v-if="searchError" class="text-red-600 px-8 mb-6">{{ searchError }}</p>
      <div v-if="searchResult.id" class="flex flex-row items-center hover:bg-gray-300 hover:shadow-inner px-8">
        <div class="flex-grow py-4">
          <h4 class="text-gray-800 mb-0">{{ searchResult.title }}</h4>
          <p class="text-sm mb-0">{{ searchResult.genre }}; {{ searchResult.year }}</p>
        </div>
        <button class="btn btn-black">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from '@/components/InputSearch.vue';
import {computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListAddModal',
  components: {
    InputSearch
  },
  props: {
    mode: String
  },
  setup(props) {
    const store = useStore();

    const currentUser = computed(() => store.getters['user/currentUser']);
    const modalOpen = computed(() => store.getters['list/addTitleOpen']);
    const searchError = ref('');
    const searchResult = ref({
      id: '',
      image: '',
      imdbRating: '',
      genre: '',
      plot: '',
      title: '',
      user: currentUser.value.email,
      year: '',
    });

    const closeModal = () => {
      if(modalOpen.value) {
        searchError.value = ''; // reset previous search when closing the modal
        searchResult.value = Object.create({}); // reset previous search when closing the modal
        store.dispatch('list/toggleAddTitleModal', false);
      }
    };

    const doSearch = (val) => {
      const key = process.env.VUE_APP_OMDB;

      searchError.value = ''; // reset previous search
      searchResult.value = Object.create({}); // reset previous search

      fetch(`https://www.omdbapi.com/?t=${val}&apikey=${key}`, {method: 'POST'})
        .then(response => {
          return response.json();
        })
        .then(res => {
          if(res.Error) {
            searchError.value = res.Error;
          } else {
            searchResult.value.id = res.imdbID;
            searchResult.value.image = res.Poster;
            searchResult.value.imdbRating = res.imdbRating;
            searchResult.value.genre = res.Genre;
            searchResult.value.plot = res.Plot;
            searchResult.value.title = res.Title;
            searchResult.value.year = res.Year;
          }
        })
        .catch((error) => {
          console.log("OMDB API error", error);
          searchError.value = `API error - please try again later.`;
        })
    }

    return {
      closeModal,
      doSearch,
      modalOpen,
      searchError,
      searchResult
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
      top: 200px;
    }
  }
  @media(min-width:1440px) {
    .list-add-modal {
      @apply max-w-xl;
    }
  }
</style>