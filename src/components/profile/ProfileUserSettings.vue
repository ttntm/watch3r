<script setup>
  import InputCheckbox from '@/components/input/InputCheckbox.vue'
  import InputRadio from '@/components/input/InputRadio.vue'
  import InputSelectNumber from '@/components/input/InputSelectNumber.vue'
  import { computed, reactive, watch } from 'vue'
  import { useStore } from 'vuex'

  const emit = defineEmits(['update:settings'])

  const store = useStore()
  
  const allSortModes = computed(() => store.getters['tools/sortMode'])
  const userOptions = computed(() => store.getters['user/userOptions'])

  const pages = ['watchlist', 'tracklist']

  const settings = reactive({
    user_explore: userOptions.value.showExploreLinks,
    user_imdb: userOptions.value.showIMDbLinks,
    user_sort: userOptions.value.sortPreset,
    user_start: pages[userOptions.value.startPage],
    user_watching: userOptions.value.showWatching
  })

  watch(settings, () => {
    emit('update:settings', { ...settings })
  })

  watch(userOptions, () => {
    settings.user_explore = userOptions.value.showExploreLinks
    settings.user_imdb = userOptions.value.showIMDbLinks
    settings.user_sort = userOptions.value.sortPreset
    settings.user_start = pages[userOptions.value.startPage]
    settings.user_watching = userOptions.value.showWatching
  })

  const events = {
    onUpdateExploreLinks(e) { settings.user_explore = e },
    onUpdateIMDbLinks(i) { settings.user_imdb = i },
    onUpdateStartPage(s) { settings.user_start = s },
    onUpdateUserSort(o) { settings.user_sort = o },
    onUpdateWatching(w) { settings.user_watching = w }
  }
</script>

<template>
  <h1 class="text-2xl text-blue-800">Settings</h1>
  <div class="input-group mb-8">
    <label>Start Page</label>
    <p class="text-xs text-gray-600 mb-3">Automatic forwarding after login.</p>
    <div class="flex flex-row">
      <InputRadio class="text-sm mr-4" name="start-page" :label="'watchlist'" :value="settings.user_start" @update:radio="events.onUpdateStartPage($event)" />
      <InputRadio class="text-sm" name="start-page" :label="'tracklist'" :value="settings.user_start" @update:radio="events.onUpdateStartPage($event)" />
    </div>
  </div>
  <div class="input-group mb-8">
    <label for="sort-preset">List Sorting</label>
    <p class="text-xs text-gray-600 mb-3">
      This option controls how lists are sorted after logging in. Does <em>not</em> override the current sort mode selection.
    </p>
    <InputSelectNumber
      :currentVal="settings.user_sort"
      :data="allSortModes"
      id="sort-preset"
      placeholder="Default Sorting"
      :styles="{
        inner: 'w-full block appearance-none bg-gray-300 border border-transparent px-2 py-1 focus:border-yellow-600 focus:shadow-inner',
        wrapper: 'w-full relative text-gray-700 text-sm bg-gray-300'
      }"
      @update:select="events.onUpdateUserSort($event)"
    >
      <template #option="{ name, order }">
        {{ name }} ({{ order }})
      </template>
    </InputSelectNumber>
  </div>
  <div class="input-group mb-8">
    <label>Display Options</label>
    <p class="text-xs text-gray-600 mb-3">
      Enable IMDb link display (search results and list items).
    </p>
    <InputCheckbox v-model="settings.user_imdb" :name="'imdb-links'" @update:cb="events.onUpdateIMDbLinks($event)">
      Show IMDb links
    </InputCheckbox>
    <p class="text-xs text-gray-600 mt-4 mb-3">
      Tracklist: display links to explore recommendations.
    </p>
    <InputCheckbox v-model="settings.user_explore" :name="'explore-links'" @update:cb="events.onUpdateExploreLinks($event)">
      Show recommendation links
    </InputCheckbox>
    <p class="text-xs text-gray-600 mt-4 mb-3">
      Watchlist: enable "currently watching" for TV series.
    </p>
    <InputCheckbox v-model="settings.user_watching" :name="'mark-watching'" @update:cb="events.onUpdateWatching($event)">
      Enable "currently watching"
    </InputCheckbox>
  </div>
</template>