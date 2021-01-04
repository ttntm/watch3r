<template>
  <section class="w-full shadow-lg mb-8 sm:mb-0 sm:mr-8">
    <InputSearch class="text-gray-700" pch="Title or Genre" @do-search="searchList($event, mode)" @reset-search="resetSearch()" />
  </section>
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

    const resetSearch = () => {
      store.dispatch('tools/resetList');
    }

    const searchList = (term, mode) => {
      store.dispatch('tools/searchList', [term, mode]);
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