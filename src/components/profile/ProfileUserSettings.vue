<template>
  <h1 class="text-2xl text-blue-800 mb-6">
    Settings
  </h1>
  <div class="input-group mb-8">
    <label>Start Page</label>
    <p class="text-xs text-gray-600 mb-3">
      Automatic forwarding after login.
    </p>
    <div class="flex flex-row">
      <InputRadio class="text-sm mr-4" name="start-page" :label="'watchlist'" :value="settings.user_start" @update:radio="updateStartPage($event)" />
      <InputRadio class="text-sm" name="start-page" :label="'tracklist'" :value="settings.user_start" @update:radio="updateStartPage($event)" />
    </div>
  </div>
  <div class="input-group mb-8">
    <label for="sort-preset">List Sorting</label>
    <p class="text-xs text-gray-600 mb-3">
      This option controls how lists are sorted after logging in. Does <em>not</em> override the current sort mode selection.
    </p>
    <div class="w-full relative text-gray-700 text-sm bg-gray-300">
      <select id="sort-preset" v-model="settings.user_sort" name="sorting">
        <option disabled value="">
          Default Sorting
        </option>
        <option v-for="(mode, index) in allSortModes" :key="index" :value="index" class="">
          {{ mode.name }} ({{ mode.order }})
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg class="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
  <div class="input-group mb-8">
    <label>Display Options</label>
    <p class="text-xs text-gray-600 mb-3">
      IMDb link display in search results and for all list items.
    </p>
    <InputCheckbox v-model="settings.user_imdb" :name="'imdb-links'" @update:cb="updateIMDbLinks($event)">
      Show IMDb links
    </InputCheckbox>
    <p class="text-xs text-gray-600 mt-4 mb-3">
      Display links to explore recommendations for items in your Tracklist.
    </p>
    <InputCheckbox v-model="settings.user_explore" :name="'explore-links'" @update:cb="updateExploreLinks($event)">
      Show recommendation links
    </InputCheckbox>
  </div>
</template>

<script>
import InputCheckbox from '@/components/input/InputCheckbox.vue';
import InputRadio from '@/components/input/InputRadio.vue';
import { computed, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ProfileUserSettings',
  components: {
    InputCheckbox,
    InputRadio
  },
  props: {
    options: Object,
  },
  emits: ['update:settings'],
  setup(props, { emit }) {
    const store = useStore();

    const settings = reactive({
      user_explore: props.options.user_explore,
      user_imdb: props.options.user_imdb,
      user_sort: props.options.user_sort,
      user_start: props.options.user_start
    });

    const updateExploreLinks = (e) => { settings.user_explore = e; }
    const updateIMDbLinks = (i) => { settings.user_imdb = i; }
    const updateStartPage = (s) => { settings.user_start = s; }

    watch(settings, () => {
      emit('update:settings', {...settings});
    })

    return {
      allSortModes: store.getters['tools/sortMode'],
      settings,
      updateExploreLinks,
      updateIMDbLinks,
      updateStartPage
    }
  }
}
</script>

<style lang="postcss" scoped>
  select, select option {
    @apply capitalize;
  }

  #sort-preset {
    @apply w-full block appearance-none bg-gray-300 border border-transparent px-2 py-1;
  }

  #sort-preset:focus {
    @apply border-yellow-600 shadow-inner;
  }
</style>