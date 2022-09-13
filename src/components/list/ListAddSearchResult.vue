<script setup>
  import BtnIMDb from '@/components/buttons/BtnIMDb.vue'
  import { computed, reactive } from 'vue'
  import { useStore } from 'vuex'
  import { checkDuplicate } from '@/helpers/shared.js'

  const props = defineProps({
    explore: Boolean,
    mode: String,
    searchResult: Object
  })

  const emit = defineEmits(['update:explore'])
  
  const store = useStore()

  const addBtnState = reactive({ 
    enabled: true, 
    text: `&plus; <span class="capitalize pointer-events-none">${props.mode}</span>`
  })
  
  const showIMDb = computed(() => store.getters['user/showIMDbLinks'])
  const writeSuccess = computed(() => store.getters['list/writeSuccess'])

  const addTitleToList = title => {
    if (isDuplicate()) {
      addBtnState.text = `Duplicate :(`
      return
    } 
    
    if (store.getters['tools/searchActive']) {
      store.dispatch('tools/resetList', props.mode)
    }
    
    store.dispatch('list/writeList', [title, props.mode])
  }

  const isDuplicate = () => {
    const id = props.searchResult.id
    if (props.explore) {
      return checkDuplicate('tracklist', id) > -1 || checkDuplicate('watchlist', id) > -1
    } else {
      return checkDuplicate(props.mode, id) > -1
    }
  }

  const onBtnClick = title => {
    addBtnState.enabled = false
    addBtnState.text = 'Adding...'

    if (props.mode !== 'explore') {
      addTitleToList(title)
    } else {
      store.dispatch('explore/updateRecSource', title)
      emit('update:explore')
    }
  }
</script>

<template>
  <section class="flex flex-col justify-start hover:bg-gray-300 hover:shadow-inner">
    <div class="flex-grow py-4">
      <h4 class="text-gray-800 mb-0">{{ searchResult.title }}</h4>
      <p class="text-sm mb-2">{{ searchResult.genre }}; {{ searchResult.year }}</p>
      <p class="text-sm text-gray-700 mb-0">{{ searchResult.plot }}</p>
    </div>
    <div class="w-full flex flex-row items-center justify-start mb-4">
      <button
        v-click-blur
        :class="{ 'btn btn-black text-sm' : addBtnState.enabled }"
        :disabled="!addBtnState.enabled"
        @click.prevent="onBtnClick(searchResult)"
      >
        <span v-if="writeSuccess" class="pointer-events-none">Added &#10003;</span>
        <span v-else class="pointer-events-none" v-html="addBtnState.text" />
      </button>
      <BtnIMDb v-if="showIMDb" :id="searchResult.id" display="text" class="text-xs text-yellow-600 hover:text-black ml-8" />
    </div>
  </section>
</template>