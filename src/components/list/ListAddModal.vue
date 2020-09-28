<template>
  <div v-if="modalOpen" class="list-add-modal" v-click-outside="closeModal">
    <div class="flex flex-row justify-between items-center pt-4">
      <h3 class="text-gray-600 text-base px-8 mb-0">Add Title to <span class="capitalize">{{ mode }}</span></h3>
      <button
        @click.prevent="closeModal()"
        class="font-bold text-gray-800 text-2xl opacity-75 cursor-pointer px-6 hover:opacity-100 focus:outline-none"
      >×</button>
    </div>
    <div class="text-gray-600 pt-4 pb-8">
      <InputSearch class="px-8 mb-6" />
      <div class="flex flex-row items-center hover:bg-gray-300 hover:shadow-inner px-8">
        <div class="flex-grow py-4">
          <h4 class="text-gray-800 mb-0">The Blue Bird</h4>
          <p class="text-sm mb-0">Comedy, 2004</p>
        </div>
        <button class="btn btn-black">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from '@/components/InputSearch.vue';
import {computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListAddModal',
  components: {
    InputSearch
  },
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
  @media(min-width:1440px) {
    .list-add-modal {
      @apply max-w-xl;
    }
  }
</style>