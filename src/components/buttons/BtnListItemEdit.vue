<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  const props = defineProps({
    id: String,
    mode: String
  })

  const store = useStore()

  const btnText = computed(() => props.mode === 'tracklist' ? 'Edit' : 'Watched')

  const onBtnClick = (id, mode) => {
    store.dispatch('list/selectEditTitle', [id, mode])
    store.dispatch('app/toggleWindow', 3)
  }
</script>

<template>
  <button
    v-click-blur
    class="btn btn-black flex flex-row items-center justify-center click-outside-ignore"
    @click.prevent="onBtnClick(id, mode)"
  >
    <svg v-if="mode === 'tracklist'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit mr-1" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
      <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
      <line x1="16" y1="5" x2="19" y2="8" />
    </svg>
    <svg v-if="mode === 'watchlist'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-check mr-1" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2l4 -4" />
    </svg>
    {{ btnText }}
  </button>
</template>