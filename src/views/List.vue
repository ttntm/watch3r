<template>
  <div id="list" class="">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-8 sm:mb-0">
        <h2 class="text-yellow-600 capitalize">{{ mode }}</h2>
        <p class="mb-0">
          {{ subtitle }}
          <span v-if="listLength !== 0" class="font-bold">Your {{ mode }} contains {{ listLength }} items.</span>
        </p>
      </div>
      <div>
        <BtnAddTitle />
        <ListAddModal v-if="addModalOpen" :mode="mode" />
      </div>
    </div>
    <ListLoading v-if="listLength === 0 && !searchActive" />
    <div v-else class="sm:px-12 my-8">
      <div class="flex flex-col sm:flex-row items-center">
        <ListSearch :mode="mode" class="flex-1" />
        <ListSort :mode="mode" class="flex-1" />
      </div>
      <ListSearchStatus v-if="searchActive" :mode="mode" class="mt-8" />
    </div>
    <div v-if="listLength > 0" class="list">
      <ListItem v-for="title in listData" :item="title" :key="title.id" :mode="mode" />
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
    const listData = computed(() => store.getters[`list/${mode.value}`]);
    const listLength = computed(() => listData.value.length);
    const mode = computed(() => route.meta.mode);
    const searchActive = computed(() => store.getters['tools/searchActive']);
    const subtitle = computed(() => route.meta.subtitle);

    const getListData = () => {
      if (listData.value.length === 0 && !searchActive.value) {
        store.dispatch('list/readList', mode.value);
      }
    }

    onBeforeUpdate(() => {
      getListData(); // necessary re-hydration when navigating between list modes; vue re-uses components wherever possible...
      if (listLength.value > 0) {
        store.dispatch('tools/updateSort', mode.value);
      }
    })

    getListData(); // initial data load as in what used to be 'created()'

    return {
      addModalOpen,
      editModalOpen,
      listData,
      listLength,
      mode,
      searchActive,
      subtitle,
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>
