<template>
  <div v-if="searchResult.id" class="flex flex-row items-center hover:bg-gray-300 hover:shadow-inner">
    <div class="flex-grow py-4">
      <h4 class="text-gray-800 mb-0">{{ searchResult.title }}</h4>
      <p class="text-sm mb-0">{{ searchResult.genre }}; {{ searchResult.year }}</p>
      <a :href="`https://www.imdb.com/title/${searchResult.id}`" target="_blank" rel="noopener" class="text-xs text-yellow-600 hover:text-black" title="View on IMDb">View on IMDb</a>
    </div>
    <button
      @click.prevent="addTitleToList(searchResult)"
      :class="{ 'btn btn-black' : addBtnState.enabled }"
      :disabled="!addBtnState.enabled"
      v-click-blur
    >
      <span v-if="writeSuccess">Added &#10003;</span>
      <span v-else>{{ addBtnState.text }}</span>
    </button>
  </div>
</template>

<script>
import {computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListAddSearchResult',
  props: {
    mode: String,
    searchResult: Object
  },
  setup(props) {
    const store = useStore();

    const addBtnState = ref({ enabled: true, text: 'Add' });
    const writeSuccess = computed(() => store.getters['list/writeSuccess']);

    const addTitleToList = (title) => {
      const listMode = props.mode;

      addBtnState.value.enabled = false;
      addBtnState.value.text = 'Adding...';

      store.dispatch('list/writeList', [title, listMode]);
    }

    return {
      addBtnState,
      addTitleToList,
      writeSuccess
    }
  }
}
</script>

<style>

</style>