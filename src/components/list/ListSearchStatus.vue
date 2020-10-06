<template>
  <p class="text-sm text-center text-gray-500 mb-0">
    {{ searchStatus }} <a href="#clear" @click.prevent="resetSearch()" class="text-yellow-600 hover:underline focus:underline">Clear search</a>
  </p>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListSearchStatus',
  props: {
    mode: String
  },
  setup(props) {
    const store = useStore();

    const searchStatus = computed(() => store.getters['tools/searchStatus']);

    const resetSearch = () => {
      store.dispatch('tools/resetList');
    }

    return {
      resetSearch,
      searchStatus
    }
  }
}
</script>

<style>

</style>