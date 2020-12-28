<template>
  <section class="list-modal text-gray-600" role="dialog" aria-labelledby="add-modal-heading" v-click-outside="closeModal" v-esc="closeModal" v-scroll-lock>
    <section class="flex flex-row justify-between items-center px-8" :class="{ 'mb-4' : contentExplore || contentImport }">
      <h3 id="add-modal-heading" class="text-base mb-0">Add Title to <span class="capitalize">{{ mode }}</span></h3>
      <button
        @click.prevent="closeModal()"
        class="font-bold text-gray-800 text-xl opacity-75 cursor-pointer hover:opacity-100 focus:outline-none"
        title="Close"
      >×</button>
    </section>
    <section v-if="!contentExplore && !contentImport" class="px-8 py-6">
      <InputSearch @do-search="doSearch($event)" :autofocus="true" pch="Title or IMDb ID" />
      <div class="flex flex-row items-center text-sm mt-4">
        <span class="font-bold mr-2">Mode:</span>
        <InputRadio class="mr-4" name="search-mode" :label="'title'" :value="searchMode" @update:radio="updateSearchMode($event)" />
        <InputRadio class="" name="search-mode" :label="'id'" :value="searchMode" @update:radio="updateSearchMode($event)" />
      </div>
    </section>
    <ListAddSearchResult v-if="searchResult.id" :explore="!contentExplore ? false : true" :mode="mode" :searchResult="searchResult" class="px-8" />
    <p v-if="searchStatus" v-html="searchStatus" class="text-center px-8 mt-6 mb-0" />
  </section>
</template>

<script>
import InputRadio from '@/components/input/InputRadio.vue';
import InputSearch from '@/components/input/InputSearch.vue';
import ListAddSearchResult from '@/components/list/ListAddSearchResult.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { getOMDB, searchResult, searchStatus } from '@/helpers/get-omdb.js';

export default {
  name: 'ListAddModal',
  components: {
    InputRadio,
    InputSearch,
    ListAddSearchResult
  },
  props: {
    contentExplore: Object,
    contentImport: Object,
    mode: String
  },
  setup(props) {
    const store = useStore();

    const fn = store.getters['app/functions'];
    const searchMode = ref('title');

    const closeModal = () => {
      store.dispatch('app/toggleWindow', 0);
      store.dispatch('list/toggleWriteSuccess', false); // reset previous write success (if any) when closing this modal
    }

    const doSearch = (val) => {
      const searchQuery = {
        prefix: searchMode.value === 'title' ? 't' : 'i', // see: https://www.omdbapi.com/#parameters
        query: val
      }
      getOMDB(fn.omdbGet, searchQuery);
    }

    const updateSearchMode = (m) => { searchMode.value = m; };

    // clear previous search result/status on modal creation; do this before evaluating 'explore' content to make sure the spinner gets shown properly
    searchResult.value = {};
    searchStatus.value = '';

    if (props.contentExplore) {
      getOMDB(fn.tmdbToOmdb, props.contentExplore);
    }

    if (props.contentImport) {
      getOMDB(fn.omdbGet, props.contentImport);
    }

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