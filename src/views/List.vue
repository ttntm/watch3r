<template>
  <div id="list" class="">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between">
      <div class="mb-8 sm:mb-0 sm:mr-8 lg:mr-0">
        <h2 class="text-yellow-600 capitalize">{{ mode }}</h2>
        <p class="mb-0">
          {{ subtitle }}
          <span v-if="listLength !== 0  && !searchActive" class="font-bold">Your {{ mode }} contains {{ listLength }} items.</span>
        </p>
      </div>
      <div class="flex-shrink-0">
        <BtnAddTitle />
        <transition name="modal">
          <ListAddModal v-if="addModalOpen" :mode="mode" />
        </transition>
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
      <ListItem v-for="title in listData" :item="title" :key="title.id" :mode="mode" @open-poster="showPoster($event)" />
    </div>
    <transition name="modal">
      <ListEditModal v-if="editModalOpen" :mode="mode" />
    </transition>
    <transition name="poster">
      <ListPosterModal v-if="posterModalOpen" :poster="posterSrc" :title="posterTitle" />
    </transition>
    <transition name="overlay">
      <div v-if="addModalOpen || editModalOpen || posterModalOpen" class="overlay" />
    </transition>
  </div>
</template>

<script>
import BtnAddTitle from '@/components/buttons/BtnAddTitle.vue';
import ListAddModal from '@/components/list/ListAddModal.vue';
import ListEditModal from '@/components/list/ListEditModal.vue';
import ListItem from '@/components/list/ListItem.vue';
import ListLoading from '@/components/list/ListLoading.vue';
import ListPosterModal from '@/components/list/ListPosterModal.vue';
import ListSearch from '@/components/list/ListSearch.vue';
import ListSearchStatus from '@/components/list/ListSearchStatus.vue';
import ListSort from '@/components/list/ListSort.vue';
import { computed, onBeforeUpdate, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'List',
  components: {
    BtnAddTitle,
    ListAddModal,
    ListEditModal,
    ListItem,
    ListLoading,
    ListPosterModal,
    ListSearch,
    ListSearchStatus,
    ListSort
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    const listData = computed(() => store.getters[`list/${mode.value}`]);
    const listLength = computed(() => listData.value.length);
    const mode = computed(() => route.meta.mode);
    const posterModalOpen = computed(() => store.getters['app/posterOpen']);
    const posterSrc = ref('');
    const posterTitle = ref('');
    const searchActive = computed(() => store.getters['tools/searchActive']);

    const getListData = () => {
      if (listData.value.length === 0 && !searchActive.value) {
        store.dispatch('list/readList', mode.value);
      }
    }

    const showPoster = (args) => {
      const [src, title] = args;
      posterSrc.value = src;
      posterTitle.value = title;
      store.dispatch('app/togglePosterModal', true);
    }

    onBeforeUpdate(() => {
      // to keep the respective list sorted when adding/removing items
      if (listLength.value > 0) {
        store.dispatch('tools/updateSort', mode.value);
      }
    })

    getListData(); // initial data load as in what used to be 'created()'

    store.dispatch('tools/updateSort', mode.value);

    return {
      addModalOpen: computed(() => store.getters['app/addTitleOpen']),
      editModalOpen: computed(() => store.getters['app/editTitleOpen']),
      listData,
      listLength,
      posterModalOpen,
      mode,
      showPoster,
      posterSrc,
      posterTitle,
      searchActive,
      subtitle: computed(() => route.meta.subtitle)
    }
  }
}
</script>

<style lang="postcss" scoped>
  .overlay {
    @apply z-10 fixed bg-gray-900 top-0 bottom-0 left-0 right-0 w-full h-full;
    opacity: 0.9;
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.75s;
  }

  .overlay-enter-active,
  .overlay-leave-active,
  .poster-enter-active,
  .poster-leave-active {
    transition: opacity 0.5s;
  }

  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(-100px);
    opacity: 0;
  }

  .overlay-enter-from,
  .overlay-leave-to,
  .poster-enter-from,
  .poster-leave-to {
    opacity: 0;
  }
</style>
