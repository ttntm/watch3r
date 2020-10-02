<template>
  <div class="w-full shadow-lg mb-8 sm:mb-0 sm:mr-8">
    <InputSearch @do-search="searchList($event, mode)" @reset-search="resetSearch(mode)" class="text-gray-700" pch="Title or Genre" />
  </div>
</template>

<script>
import InputSearch from '@/components/input/InputSearch.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListSearch',
  components: {
    InputSearch
  },
  props: {
    mode: String
  },
  setup(props) {
    const store = useStore();

    const resetSearch = (mode) => {
      store.dispatch('list/resetList', [mode]);
    }

    const searchList = (term, mode) => {
      // handle "clearSearch()" somehow, better in here than inside the search input...
      store.dispatch('list/searchList', [term, mode])
    }

    return {
      resetSearch,
      searchList
    }
  }
}
</script>

<style>

</style>