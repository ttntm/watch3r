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
      <div v-if="searchResult.id" class="flex flex-row items-center hover:bg-gray-300 hover:shadow-inner px-8">
        <div class="flex-grow py-4">
          <h4 class="text-gray-800 mb-0">{{ searchResult.title }}</h4>
          <p class="text-sm mb-0">{{ searchResult.genre }}; {{ searchResult.year }}</p>
        </div>
        <button
          @click.prevent="addTitleToList(searchResult)"
          class="btn btn-black"
          :disabled="!addBtnState.enabled"
        >{{ addBtnState.text }}</button>
      </div>
      <p v-if="searchStatus" v-html="searchStatus" class="px-8 py-4 mb-0" />
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

    const addBtnState = ref({
      enabled: true,
      text: 'Add'
    });
    const currentUser = computed(() => store.getters['user/currentUser']);
    const modalOpen = computed(() => store.getters['list/addTitleOpen']);
    const searchResult = ref({});
    const searchStatus = ref('');

    const closeModal = () => {
      if(modalOpen.value) {
        searchStatus.value = ''; // reset previous search when closing the modal
        searchResult.value = Object.create({}); // reset previous search when closing the modal
        store.dispatch('list/toggleAddTitleModal', false);
      }
    };

    const doSearch = (val) => {
      const key = process.env.VUE_APP_OMDB;

      addBtnState.value.enabled = true;
      addBtnState.value.text = 'Add';
      searchStatus.value = ''; // reset previous search
      searchResult.value = Object.create({}); // reset previous search

      fetch(`https://www.omdbapi.com/?t=${val}&apikey=${key}`, {method: 'POST'})
        .then(response => {
          return response.json();
        })
        .then(res => {
          if(res.Error) {
            // response -> title not found
            searchStatus.value = res.Error;
          } else {
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

    const addTitleToList = (title) => {
      const listMode = props.mode;

      // console.log(listMode);

      addBtnState.value.enabled = false;
      addBtnState.value.text = 'Adding...';

      store.dispatch('list/writeList', [title, listMode]);
    }

    return {
      addBtnState,
      addTitleToList,
      closeModal,
      doSearch,
      modalOpen,
      searchResult,
      searchStatus,
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