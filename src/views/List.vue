<template>
  <div id="list" class="">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-8 sm:mb-0">
        <h2 class="text-yellow-600 capitalize">{{ mode }}</h2>
        <p class="mb-0">{{ subtitle }}</p>
      </div>
      <div>
        <BtnAddTitle />
        <ListAddModal v-if="addModalOpen" :mode="mode" />
      </div>
    </div>
    <ListLoading v-if="dataDisplay.length === 0 && !searchActive" />
    <div v-else class="sm:px-12 my-8">
      <div class="flex flex-col sm:flex-row items-center">
        <ListSearch :mode="mode" class="flex-1" />
        <ListSort :mode="mode" class="flex-1" />
      </div>
      <ListSearchStatus v-if="searchActive" :mode="mode" class="mt-8" />
    </div>
    <div v-if="dataDisplay.length > 0" class="list">
      <ListItem v-for="title in dataDisplay" :item="title" :key="title.id" :mode="mode" />
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
import { computed, onBeforeUpdate, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  name: 'List',
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
    const route = useRoute();
    const store = useStore();

    const addModalOpen = computed(() => store.getters['list/addTitleOpen']);
    const editModalOpen = computed(() => store.getters['list/editTitleOpen']);
    const list = computed(() => store.getters[`list/${mode.value}`]);
    const mode = computed(() => route.meta.mode);
    const searchActive = computed(() => store.getters['tools/searchActive']);
    const subtitle = computed(() => route.meta.subtitle);

    const dataDisplay = computed(() => {
      let tmp = [...list.value]
      return tmp.reverse();
    });

    store.dispatch('list/readList', mode.value);

    onBeforeUpdate(() => {
      // necessary when navigating between list modes; vue re-uses component wherever possible...
      if (list.value.length === 0 && !searchActive.value) {
        store.dispatch('list/readList', mode.value);
      }
    })

    return {
      addModalOpen,
      dataDisplay,
      editModalOpen,
      mode,
      searchActive,
      subtitle,
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>