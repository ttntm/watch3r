<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  
  const props = defineProps({
    display: {
      type: String,
      default: 'text'
    },
    item: Object,
    watching: {
      type: Boolean,
      default: false
    }
  })

  const store = useStore()

  const btnText = computed(() => {
    return props.watching ? 'Remove "watching" marker' : 'Mark as "watching"'
  })

  const onBtnClick = () => {
    const update = { ...props.item }
    
    update.watching = !props.watching
    
    store.dispatch('list/editListItem', [update, 'watchlist'])
    
    if (store.getters['app/windowOpen'] === 6) {
      store.dispatch('app/toggleWindow', 0) // close mobile list controls modal
    }
  }
</script>

<template>
  <button
    v-click-blur
    :class="{ 'watching-link-text hidden lg:inline-flex' : display === 'text' }"
    @click="onBtnClick"
  >
    <svg v-if="display === 'text'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-right" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="9 6 15 12 9 18" />
    </svg>
    {{ btnText }}
  </button>
</template>

<style lang="postcss" scoped>
  .watching-link-text {
    @apply flex-row items-center text-gray-600 text-sm leading-none mt-2;
  }

  .watching-link-text:hover {
    @apply text-gray-900;
  }
</style>