<script setup>
  import InputSearch from '@/components/input/InputSearch.vue'
  import { useStore } from 'vuex'

  const props = defineProps({
    mode: String
  })

  const store = useStore()

  const events = {
    onResetSearch() {
      store.dispatch('tools/resetList')
    },

    onDoSearch(term, mode) {
      store.dispatch('tools/searchList', [term, mode])
    }
  }
</script>

<template>
  <section class="w-full shadow-lg mb-8 sm:mb-0 sm:mr-8">
    <InputSearch class="text-gray-700" pch="Title or Genre" @do-search="events.onDoSearch($event, mode)" @reset-search="events.onResetSearch()" />
  </section>
</template>