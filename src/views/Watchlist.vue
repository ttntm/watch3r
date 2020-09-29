<template>
  <div id="watchlist" class="">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <div class="mb-8 sm:mb-0">
        <h2 class="text-yellow-600">Watchlist</h2>
        <p class="mb-0">Add titles to your watchlist so you don't lose track of things.</p>
      </div>
      <div>
        <BtnAddTitle />
        <ListAddModal :mode="mode" />
      </div>
    </div>
    <div class="text-center mb-8">
      Search | Filters | Sorting
    </div>
    <div v-if="watchlistDisplay.length > 0" class="list watchlist">
      <ListItem v-for="title in watchlistDisplay" :item="title" :key="title.id" :mode="mode" />
    </div>
    <p v-else>Nothing here yet...</p>
    <ListEditModal />
  </div>
</template>

<script>
import BtnAddTitle from '@/components/buttons/BtnAddTitle.vue';
import ListAddModal from '@/components/list/ListAddModal.vue';
import ListEditModal from '@/components/list/ListEditModal.vue';
import ListItem from '@/components/list/ListItem.vue';
import {computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Watchlist',
  components: {
    BtnAddTitle,
    ListAddModal,
    ListEditModal,
    ListItem
  },
  setup() {
    const store = useStore();

    const mode = ref('watchlist');
    const watchlist = computed(() => store.getters['list/watchlist']);
    const watchlistDisplay = computed(() => {
      let tmp = [...watchlist.value]
      return tmp.reverse();
    });

    if (watchlist.value.length === 0) {
      store.dispatch('list/readList', mode.value);
    }

    return {
      mode,
      watchlist,
      watchlistDisplay
    }
  }
}
</script>

<style lang="postcss" scoped>
  .list .list-item:last-child {
    @apply border-transparent;
  }
</style>