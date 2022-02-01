<script setup>
  import { computed, ref, watch } from 'vue'
  import { useStore } from 'vuex'

  const store = useStore()

  const selected = ref({})

  const recSource = computed(() => store.getters['explore/recSource'])
  const tracklist = computed(() => store.getters['list/tracklist'])

  watch(recSource, () => updateSelect())

  const onChange = () => {
    store.dispatch('explore/updateRecSource', selected.value)
  }

  const updateSelect = () => { selected.value = recSource.value }

  if (tracklist.value.length === 0) {
    // fallback for an empty tracklist which can happen when navigating into 'explore' directly after login
    store.dispatch('list/readList', 'tracklist')
  }

  if (recSource.value && recSource.value.id) {
    const found = tracklist.value.find(item => item.id === recSource.value.id)
    // set the matching object as the selected one
    // this is necessary due to a different set of keys on the DB objects (tracklist) compared to manually added 'recSource' objects
    if (found) selected.value = found
  }
</script>

<template>
  <div class="w-full relative text-gray-700 bg-gray-300 shadow-lg">
    <select id="explore-select" v-model.lazy="selected" name="explore-title" @change="onChange(selected)">
      <option disabled :value="{}" :selected="selected === {}">
        Select Title...
      </option>
      <option v-for="(item, index) in tracklist" :key="index" :value="item">
        {{ item.title }} ({{ item.year }})
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg class="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  select, select option {
    @apply capitalize;
  }

  #explore-select {
    @apply w-full block appearance-none bg-transparent border border-transparent px-3 py-2;
  }

  #explore-select:focus {
    @apply border-yellow-600 shadow-inner;
  }
</style>