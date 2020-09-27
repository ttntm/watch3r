<template>
  <div v-if="modalOpen" class="list-add-modal" v-click-outside="closeModal">
    <div class="flex flex-row justify-between items-center pt-4">
      <p class="text-gray-600 font-bold px-8 mb-0">Add Title</p>
      <button
        @click.prevent="closeModal()"
        class="font-bold text-gray-800 text-2xl opacity-75 cursor-pointer px-6 hover:opacity-100 focus:outline-none"
      >×</button>
    </div>
    <div class="text-gray-600 px-8 pt-4 pb-8">
      <p>Displaying modal for {{ mode }}</p>
      <p>Display a search bar here and get title data from API</p>
      <p>List search results below with a button to add them to the respective list based on "mode" prop and a vuex action.</p>
    </div>
  </div>
</template>

<script>
import {computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListAddModal',
  props: {
    mode: String
  },
  setup(props) {
    const store = useStore();

    const modalOpen = computed(() => store.getters['list/addTitleOpen']);

    const closeModal = () => {
      if(modalOpen.value) {
        store.dispatch('list/toggleAddTitleModal', false);
      }
    };

    return {
      closeModal,
      modalOpen
    }
  }
}
</script>

<style lang="postcss" scoped>
  .list-add-modal {
    @apply fixed left-0 right-0 z-20 bg-gray-200 rounded-lg shadow-lg mx-auto;
    width: calc(100% - 2rem);
    top: 200px;
  }
  @media(min-width:768px) {
    .list-add-modal {
      @apply w-2/3;
    }
  }
  @media(min-width:1024px) {
    .list-add-modal {
      @apply w-1/2;
    }
  }
</style>