<template>
  <p class="text-sm text-center text-gray-500 font-bold mb-0">
    {{ searchStatus }} <a href="#clear" class="text-yellow-600 font-normal hover:underline focus:underline" @click.prevent="resetSearch()">Clear search</a>
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

    const inputLength = computed(() => store.getters[`list/${props.mode}Cache`].length);
    const resultLength = computed(() => store.getters[`list/${props.mode}`].length);

    const searchStatus = computed(() => {
      if (resultLength.value > 0) {
        return `Showing ${resultLength.value} of ${inputLength.value} listed titles.`;
      } else {
        return 'No results.';
      }
    });

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