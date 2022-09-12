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

    onDoSearch(term) {
      if (term) {
        store.dispatch('tools/searchList', [term, props.mode])
      }
    }
  }
</script>

<template>
  <section class="w-full text-sm lg:text-base shadow-lg mb-8 md:mb-0 md:mr-4 lg:mr-8">
    <InputSearch class="text-gray-700" pch="Title or Genre" @do-search="events.onDoSearch($event)" @reset-search="events.onResetSearch()" />
  </section>
</template>