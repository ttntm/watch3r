<template>
  <div id="watchlist" class="">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-8 sm:mb-0">
        <h2 class="text-yellow-600">Watchlist</h2>
        <p class="mb-0">Add titles to your watchlist so you don't lose track of things.</p>
      </div>
      <div>
        <BtnAddTitle />
        <ListAddModal v-if="addModalOpen" :mode="mode" />
      </div>
    </div>
    <div class="flex flex-col sm:flex-row items-center px-12 mt-8 mb-10">
      <ListSearch :mode="mode" class="flex-1" />
      <ListSort :mode="mode" class="flex-1" />
      <!-- show some status here -->
    </div>
    <div v-if="watchlistDisplay.length > 0" class="list watchlist">
      <ListItem v-for="title in watchlistDisplay" :item="title" :key="title.id" :mode="mode" />
    </div>
    <p v-else>Nothing here yet...</p>
    <ListEditModal v-if="editModalOpen" :mode="mode" />
  </div>
</template>

<script>
import BtnAddTitle from '@/components/buttons/BtnAddTitle.vue';
import ListAddModal from '@/components/list/ListAddModal.vue';
import ListEditModal from '@/components/list/ListEditModal.vue';
import ListItem from '@/components/list/ListItem.vue';
import ListSearch from '@/components/list/ListSearch.vue';
import ListSort from '@/components/list/ListSort.vue';
import {computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Watchlist',
  components: {
    BtnAddTitle,
    ListAddModal,
    ListEditModal,
    ListItem,
    ListSearch,
    ListSort
  },
  setup() {
    const store = useStore();

    const addModalOpen = computed(() => store.getters['list/addTitleOpen']);
    const editModalOpen = computed(() => store.getters['list/editTitleOpen']);
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
      addModalOpen,
      editModalOpen,
      mode,
      watchlistDisplay
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>