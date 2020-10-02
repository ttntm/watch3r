<template>
  <div id="tracklist" class="">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <div class="mb-8 sm:mb-0">
        <h2 class="text-yellow-600">Tracklist</h2>
        <p class="mb-0">Track watched titles, rate them and write down some notes.</p>
      </div>
      <div>
        <BtnAddTitle />
        <ListAddModal v-if="addModalOpen" :mode="mode" />
      </div>
    </div>
    <ListLoading v-if="tracklistDisplay.length === 0 && !searchActive" />
    <div v-else class="sm:px-12 mt-8 mb-10">
      <div class="flex flex-col sm:flex-row items-center">
        <ListSearch :mode="mode" class="flex-1" />
        <ListSort :mode="mode" class="flex-1" />
      </div>
      <ListSearchStatus v-if="searchActive" :mode="mode" class="mt-8" />
    </div>
    <div v-if="tracklistDisplay.length > 0" class="list tracklist">
      <ListItem v-for="title in tracklistDisplay" :item="title" :key="title.id" :mode="mode" />
    </div>
    <ListEditModal v-if="editModalOpen" :mode="mode" />
  </div>
</template>

<script>
import BtnAddTitle from '@/components/buttons/BtnAddTitle.vue';
import ListAddModal from '@/components/list/ListAddModal.vue';
import ListEditModal from '@/components/list/ListEditModal.vue';
import ListItem from '@/components/list/ListItem.vue';
import ListLoading from '@/components/list/ListLoading.vue';
import ListSearch from '@/components/list/ListSearch.vue';
import ListSearchStatus from '@/components/list/ListSearchStatus.vue';
import ListSort from '@/components/list/ListSort.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Tracklist',
  components: {
    BtnAddTitle,
    ListAddModal,
    ListEditModal,
    ListItem,
    ListLoading,
    ListSearch,
    ListSearchStatus,
    ListSort
  },
  setup() {
    const store = useStore();

    const addModalOpen = computed(() => store.getters['list/addTitleOpen']);
    const editModalOpen = computed(() => store.getters['list/editTitleOpen']);
    const mode = ref('tracklist');
    const searchActive = computed(() => store.getters['tools/searchActive']);
    const tracklist = computed(() => store.getters['list/tracklist']);
    const tracklistDisplay = computed(() => {
      let tmp = [...tracklist.value]
      return tmp.reverse();
    });

    if (tracklist.value.length === 0) {
      store.dispatch('list/readList', mode.value);
    }

    return {
      addModalOpen,
      editModalOpen,
      mode,
      searchActive,
      tracklist,
      tracklistDisplay
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>