<template>
  <section class="list-item-menu" v-click-outside="closeModal" v-esc="closeModal" v-scroll-lock>
    <section class="flex flex-row justify-between items-center py-2">
      <p class="font-bold text-sm px-4 mb-0">Actions</p>
      <button
        @click.prevent="closeModal()"
        class="font-bold text-gray-800 text-xl opacity-75 cursor-pointer px-4 hover:opacity-100 focus:outline-none"
        title="Close Menu"
      >×</button>
    </section>
    <section class="flex flex-col text-gray-800">
      <p class="text-gray-600 text-center px-4 mb-2">{{ item.title }}</p>
      <router-link v-if="showExplore && mode === 'tracklist'" :to="{ name: 'explore', query: { title: item.id } }" class="menu-item">
        Get Recommendations
      </router-link>
      <a v-if="showIMDb" :href="`https://www.imdb.com/title/${item.id}`" class="menu-item" target="_blank" rel="noopener" title="View on IMDb">
        View on IMDb
      </a>
      <BtnListItemRemove display="text" :id="item.refId" :mode="mode" class="menu-item" />
    </section>
  </section>
</template>

<script>
import BtnListItemRemove from '@/components/buttons/BtnListItemRemove.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListItemControls',
  components: {
    BtnListItemRemove
  },
  props: {
    mode: String
  },
  setup() {
    const store = useStore();

    const closeModal = () => {
      store.dispatch('list/clearEditTitle');
      store.dispatch('app/toggleWindow', 0);
    }

    return {
      closeModal,
      item: computed(() => store.getters['list/editTitleContent']),
      showExplore: computed(() => store.getters['user/showExploreLinks']),
      showIMDb: computed(() => store.getters['user/showIMDbLinks'])
    }
  }
}
</script>

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