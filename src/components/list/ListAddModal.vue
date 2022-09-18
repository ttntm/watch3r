<script setup>
  import BtnClose from '@/components/buttons/BtnClose.vue'
  import InputRadio from '@/components/input/InputRadio.vue'
  import InputSearch from '@/components/input/InputSearch.vue'
  import ListAddSearchResult from './ListAddSearchResult.vue'
  import { computed, ref, watch } from 'vue'
  import { useStore } from 'vuex'
  import { getOMDB, searchResult, searchStatus } from '@/helpers/get-omdb.js'
  import { useDelay } from '@/helpers/shared'

  const props = defineProps({
    contentExplore: Object,
    contentImport: Object,
    mode: String
  })

  const store = useStore()

  const { isVisible, toggleDelay } = useDelay()
  
  const searchMode = ref('title')

  const fn = computed(() => store.getters['app/functions'])
  const writeSuccess = computed(() => store.getters['list/writeSuccess'])

  watch(writeSuccess, () => {
    if ((props.contentExplore || props.contentImport) && writeSuccess.value) {
      setTimeout(() => events.onClose(), 200)
    }
  })

  const events = {
    onClose() {
      toggleDelay()
      setTimeout(() => {
        store.dispatch('app/toggleWindow', 0)
        store.dispatch('list/toggleWriteSuccess', false) // reset previous write success (if any) when closing this modal
      }, 100)
    },
  
    onDoSearch(val) {
      const searchQuery = {
        prefix: searchMode.value === 'title' ? 't' : 'i', // see: https://www.omdbapi.com/#parameters
        query: val
      }
      getOMDB(fn.value.omdbGet, searchQuery)
    },
  
    onUpdateSearchMode(m) {
      searchMode.value = m
    }
  }

  // clear previous search result/status on modal creation; do this before evaluating 'explore' content to make sure the spinner gets shown properly
  searchResult.value = {}
  searchStatus.value = ''

  if (props.contentExplore) {
    getOMDB(fn.value.tmdbToOmdb, props.contentExplore)
  }

  if (props.contentImport) {
    getOMDB(fn.value.omdbGet, props.contentImport)
  }
</script>

<template>
  <transition name="modal">
    <section v-if="isVisible" v-click-outside="events.onClose" v-esc="events.onClose" v-scroll-lock class="list-modal text-gray-600" role="dialog" aria-labelledby="add-modal-heading">
      <section class="flex flex-row justify-between items-center px-8" :class="{ 'mb-4' : contentExplore || contentImport }">
        <h3 id="add-modal-heading" class="text-base mb-0">
          Add Title to <span class="capitalize">{{ mode }}</span>
        </h3>
        <BtnClose btn-title="Close" @click="events.onClose" />
      </section>
      <section v-if="!contentExplore && !contentImport" class="px-8 py-6">
        <InputSearch :autofocus="true" pch="Title or IMDb ID" @do-search="events.onDoSearch($event)" />
        <div class="flex flex-row items-center text-sm mt-4">
          <span class="font-bold mr-2">Mode:</span>
          <InputRadio class="mr-4" name="search-mode" :label="'title'" :value="searchMode" @update:radio="events.onUpdateSearchMode($event)" />
          <InputRadio class="" name="search-mode" :label="'id'" :value="searchMode" @update:radio="events.onUpdateSearchMode($event)" />
        </div>
      </section>
      <ListAddSearchResult v-if="searchResult.id" :explore="!!contentExplore" :mode="mode" :search-result="searchResult" @update:explore="events.onClose" class="px-8" />
      <p v-if="searchStatus" class="text-center px-8 mt-6 mb-0" v-html="searchStatus" />
    </section>
  </transition>
</template>