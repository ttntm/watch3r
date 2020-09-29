<template>
  <div id="tracklist" class="">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <div class="mb-8 sm:mb-0">
        <h2 class="text-yellow-600">Tracklist</h2>
        <p class="mb-0">Track watched titles, rate them and write down some notes.</p>
      </div>
      <div>
        <BtnAddTitle />
        <ListAddModal :mode="mode" />
      </div>
    </div>
    <div class="text-center mb-8">
      Search | Filters | Sorting
    </div>
    <div v-if="tracklistDisplay.length > 0" class="list tracklist">
      <ListItem v-for="title in tracklistDisplay" :item="title" :key="title.id" :mode="mode" />
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
import {computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Tracklist',
  components: {
    BtnAddTitle,
    ListAddModal,
    ListEditModal,
    ListItem
  },
  setup() {
    const store = useStore();

    const mode = ref('tracklist');
    const tracklist = computed(() => store.getters['list/tracklist']);
    const tracklistDisplay = computed(() => {
      let tmp = [...tracklist.value]
      return tmp.reverse();
    });

    if (tracklist.value.length === 0) {
      store.dispatch('list/readList', mode.value);
    }

    return {
      mode,
      tracklist,
      tracklistDisplay
    }
  }
}
</script>

<style lang="postcss" scoped>
  .list .list-item:last-child {
    @apply border-transparent;
  }
</style>