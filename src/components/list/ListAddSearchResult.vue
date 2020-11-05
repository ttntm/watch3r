<template>
  <section class="flex flex-col justify-start hover:bg-gray-300 hover:shadow-inner">
    <div class="flex-grow py-4">
      <h4 class="text-gray-800 mb-0">{{ searchResult.title }}</h4>
      <p class="text-sm mb-2">{{ searchResult.genre }}; {{ searchResult.year }}</p>
      <p class="text-sm text-gray-700 mb-0">{{ searchResult.plot }}</p>
    </div>
    <div class="w-full flex flex-row items-center justify-start mb-4">
      <button
        @click.prevent="addTitleToList(searchResult)"
        :class="{ 'btn btn-black text-sm' : addBtnState.enabled }"
        :disabled="!addBtnState.enabled"
        v-click-blur
      >
        <span v-if="writeSuccess" class="pointer-events-none">Added &#10003;</span>
        <span v-else v-html="addBtnState.text" class="pointer-events-none"></span>
      </button>
      <a v-if="showIMDb" :href="`https://www.imdb.com/title/${searchResult.id}`" target="_blank" rel="noopener" class="text-xs text-yellow-600 hover:text-black ml-8" title="View on IMDb">View on IMDb</a>
    </div>
  </section>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListAddSearchResult',
  props: {
    explore: Boolean,
    mode: String,
    searchResult: Object
  },
  setup(props) {
    const store = useStore();

    const addBtnState = ref({ enabled: true, text: `&plus; <span class="capitalize">${props.mode}</span>` });

    const checkDuplicateEntry = (listMode) => {
      const listCurrent = store.getters[`list/${listMode}`];
      return listCurrent.filter((item) => item.id === props.searchResult.id);
    }

    const isDuplicate = () => {
      if (props.explore) {
        return checkDuplicateEntry('tracklist').length > 0 || checkDuplicateEntry('watchlist').length > 0
      } else {
        return checkDuplicateEntry(props.mode).length > 0
      }
    }

    const addTitleToList = (title) => {
      addBtnState.value.enabled = false;
      addBtnState.value.text = 'Adding...';

      if(isDuplicate()) {
        addBtnState.value.text = `Duplicate :(`;
      } else {
        if (store.getters['tools/searchActive']) {
          store.dispatch('tools/resetList');
        }
        store.dispatch('list/writeList', [title, props.mode]);
      }
    }

    return {
      addBtnState,
      addTitleToList,
      showIMDb: computed(() => store.getters['user/showIMDbLinks']),
      writeSuccess: computed(() => store.getters['list/writeSuccess']),
    }
  }
}
</script>