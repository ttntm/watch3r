<script setup>
  import BtnClose from '@/components/buttons/BtnClose.vue'
  import BtnListItemExplore from '@/components/buttons/BtnListItemExplore.vue'
  import BtnListItemWatching from '@/components/buttons/BtnListItemWatching.vue'
  import BtnListItemRemove from '@/components/buttons/BtnListItemRemove.vue'
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { useDelay } from '@/helpers/shared'

  const props = defineProps({
    mode: String
  })

  const store = useStore()

  const { isVisible, toggleDelay } = useDelay()
  
  const item = computed(() => store.getters['list/editTitleContent'])
  const showExplore = computed(() => store.getters['user/showExploreLinks'])
  const showIMDb = computed(() => store.getters['user/showIMDbLinks'])
  const showWatching = computed(() => store.getters['user/showWatching'])

  const onCloseModal = () => {
    toggleDelay()
    setTimeout(() => {
      store.dispatch('list/clearEditTitle')
      store.dispatch('app/toggleWindow', 0)
    }, 100)
  }
</script>

<template>
  <transition name="modal">
    <section v-if="isVisible" v-click-outside="onCloseModal" v-esc="onCloseModal" v-scroll-lock class="list-item-menu">
      <section class="flex flex-row justify-between items-center px-4 py-2">
        <p class="font-bold text-sm mb-0">Actions</p>
        <BtnClose btn-title="Close Menu" @click="onCloseModal" />
      </section>
      <section class="flex flex-col text-gray-800">
        <p class="text-gray-600 text-center px-4 mb-2">{{ item.title }}</p>
        <BtnListItemWatching v-if="showWatching && mode === 'watchlist'" class="menu-item" display="menuItem" :item="item" :watching="item.watching" />
        <BtnListItemExplore v-if="showExplore && mode === 'tracklist'" class="menu-item" display="menuItem" :id="item.id" />
        <a v-if="showIMDb" :href="`https://www.imdb.com/title/${item.id}`" class="menu-item" target="_blank" rel="noopener" title="View on IMDb">
          View on IMDb
        </a>
        <BtnListItemRemove :id="item.refId" display="text" :mode="mode" class="menu-item" />
      </section>
    </section>
  </transition>
</template>

<style lang="postcss" scoped>
  .list-item-menu {
    @apply fixed left-0 right-0 z-20 max-w-xs bg-gray-200 rounded-lg shadow-lg pb-4 mx-auto;
    top:50%;
    transform: translateY(-50%);
    width: 80%;
  }

  .menu-item {
    @apply w-full block font-bold text-center py-3;
  }

  .menu-item:hover {
    @apply bg-gray-400 text-blue-800 shadow-inner;
  }
</style>