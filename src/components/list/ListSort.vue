<template>
  <div class="w-full relative text-gray-700 bg-gray-300 shadow-lg sm:ml-8">
    <select name="sorting" id="sort-list" v-model="selected" @change="sortSelect(selected)">
      <option disabled value="">Sort {{ mode }}...</option>
      <option v-for="(mode, index) in allSortModes" :key="index" :value="index" class="">{{ mode.key }} ({{ mode.order }})</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg class="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
      </svg>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListSort',
  props: {
    mode: String
  },
  setup(props) {
    const store = useStore();

    const allSortModes = store.getters['tools/sortMode'];
    const selected = ref();
    const sortCurrent = computed(() => store.getters[`tools/${props.mode}Sorted`]);
    const sortPreset = computed(() => store.getters[`user/sortPreset`]);

    const sortSelect = (val) => {
      store.dispatch('tools/sortList', [val, props.mode]);
    }

    if (sortCurrent.value === -1) {
      selected.value = sortPreset.value;
    } else {
      selected.value = sortCurrent.value;
    }

    return {
      allSortModes,
      selected,
      sortSelect
    }
  }
}
</script>

<style lang="postcss" scoped>
  #sort-list {
    @apply w-full block appearance-none bg-transparent border border-transparent px-3 py-2;
  }

  #sort-list:focus {
    @apply border-yellow-600 shadow-inner;
  }

  select, select option {
    @apply capitalize;
  }
</style>