<template>
  <section id="explore">
    <div class="sm:text-center">
      <h1 class="h2 text-yellow-600">Explore Recommendations</h1>
      <h2 class="text-base font-normal mb-0">Select a title from your Tracklist based on which you'd like to get recommendations.</h2>
    </div>
    <section class="w-full sm:w-2/3 lg:w-1/2 flex flex-row mx-auto mt-10 mb-12">
      <ExploreSelectTitle />
      <BtnExploreClear class="hidden sm:flex py-2 ml-4 sm:ml-8" />
    </section>
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 xl:gap-10 sm:px-4 xl:px-0">
      <ExploreTitleCard v-for="(item, index) in recommendations" :item="item" :key="index" :src="item.poster_path" @add-title="setAddTitleContent($event)" />
    </section>
    <div v-if="!recommendations.length && Object.keys(recSource).length > 0">
      <img :src="spinner" class="my-16 mx-auto">
    </div>
    <div v-if="recommendations.length > 0" class="text-center text-sm mt-12">
      <p>Recommendations by:</p>
      <a href="https://www.themoviedb.org" class="inline-block hover:opacity-50" target="_blank" rel="noopener">
        <img src="/img/tmdb.svg" class="block h-4 mx-auto" alt="TMDB logo">
      </a>
    </div>
  </section>
  <!-- MODALS -->
  <transition name="modal">
    <ListAddModal v-if="modalOpen === 5" :content="addTitleContent" mode="watchlist" />
  </transition>
  <!-- OVERLAY -->
  <ModalBackdrop />
  <!-- BTT Button -->
  <BtnToTop v-if="!modalOpen" />
</template>

<script>
import BtnExploreClear from '@/components/buttons/BtnExploreClear.vue';
import BtnToTop from '@/components/buttons/BtnToTop.vue';
import ExploreSelectTitle from '@/components/explore/ExploreSelectTitle.vue';
import ExploreTitleCard from '@/components/explore/ExploreTitleCard.vue';
import ListAddModal from '@/components/list/ListAddModal.vue';
import ModalBackdrop from '@/components/ModalBackdrop.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Explore',
  components: {
    BtnExploreClear,
    BtnToTop,
    ExploreSelectTitle,
    ExploreTitleCard,
    ListAddModal,
    ModalBackdrop
  },
  setup() {
    const store = useStore();

    const addTitleContent = ref({});
    const spinner = require('@/assets/loading.svg');
    const recommendations = computed(() => store.getters['explore/recList']);
    const recSource = computed(() => store.getters['explore/recSource']);

    const setAddTitleContent = (data) => {
      addTitleContent.value = Object.assign({}, data);
    }

    return {
      addTitleContent,
      modalOpen: computed(() => store.getters['app/windowOpen']),
      recommendations,
      recSource,
      setAddTitleContent,
      spinner
    }
  }
}
</script>

<style lang="postcss" scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.75s;
  }

  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(-100px);
    opacity: 0;
  }
</style>