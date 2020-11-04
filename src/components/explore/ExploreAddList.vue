<template>
  <section class="list-modal text-gray-600" role="dialog" aria-labelledby="add-modal-heading" v-click-outside="closeModal" v-esc="closeModal" v-scroll-lock>
    <section class="flex flex-row justify-between items-center px-8 mb-4">
      <h3 id="add-modal-heading" class="text-base mb-0">Add Title to Watchlist</h3>
      <button
        @click.prevent="closeModal()"
        class="font-bold text-gray-800 text-xl opacity-75 cursor-pointer hover:opacity-100 focus:outline-none"
        title="Close"
      >×</button>
    </section>
    <ListAddSearchResult v-if="item.id" mode="watchlist" :searchResult="item" class="px-8" />
    <p v-if="searchStatus" v-html="searchStatus" class="text-center px-8 py-4 mb-0" />
  </section>
</template>

<script>
import ListAddSearchResult from '@/components/list/ListAddSearchResult.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ExploreAddList',
  components: {
    ListAddSearchResult
  },
  props: {
    content: Object
  },
  setup(props) {
    const store = useStore();

    const currentUser = computed(() => store.getters['user/currentUser']);
    const fn = store.getters['app/functions'];
    const item = ref({});
    const searchStatus = ref('');
    const spinner = require('@/assets/loading.svg');

    const closeModal = () => {
      store.dispatch('app/toggleWindow', 0);
      store.dispatch('list/toggleWriteSuccess', false); // reset previous write success (if any) when closing this modal
    }

    const getOMDB = () => {
      const data = props.content;

      item.value = {};
      searchStatus.value = `<img src="${spinner}" class="mx-auto">`;
      store.dispatch('list/toggleWriteSuccess', false); // reset previous write success (if any) for each search

      fetch(fn.tmdbToOmdb, { body: JSON.stringify(data), method: 'POST' })
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
            item.value.genre = res.Genre;
            item.value.id = res.imdbID;
            item.value.image = res.Poster;
            item.value.imdbRating = res.imdbRating;
            item.value.plot = res.Plot;
            item.value.title = res.Title;
            item.value.type = res.Type;
            item.value.user = currentUser.value.email,
            item.value.year = res.Year;
          }
        })
        .catch((error) => {
          console.error("Get OMDB error", error);
          searchStatus.value = `
            <span class="text-red-600">
              API error - please try again later.
            </span>
          `;
        })
    }

    getOMDB();

    return {
      closeModal,
      item,
      searchStatus,
      spinner
    }
  }
}
</script>