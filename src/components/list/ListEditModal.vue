<template>
  <div v-if="modalOpen" class="list-edit-modal">
    <div class="flex flex-row justify-between items-center px-8">
      <h3 class="text-gray-600 text-base mb-0">Edit Title: "{{ editItem.title }}"</h3>
      <button
        @click.prevent="closeModal()"
        class="font-bold text-gray-800 text-xl opacity-75 cursor-pointer hover:opacity-100 focus:outline-none"
      >×</button>
    </div>
    <div class="text-gray-800 pt-6 pb-2">
      <div class="px-8 mb-6">
        <h4>Rating</h4>
        <input v-model="userInput.userRating" class="w-full focus:outline-none mb-6" type="range" min="0" max="10" step="0.1">
        <p class="text-sm text-gray-600 mb-4">Your Rating: {{ userInput.userRating }}</p>
        <h4>Notes</h4>
        <textarea v-model="userInput.notes" name="notes" rows="6" placeholder="Notes, comments, etc."></textarea>
      </div>
      <div class="flex flex-row px-8">
        <button class="btn btn-black mr-4">Save</button>
        <button @click.prevent="closeModal()" class="btn btn-muted">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListEditModal',
  props: {
    mode: String
  },
  setup(props) {
    const store = useStore();

    const editItem = computed(() => store.getters['list/editTitleContent']);
    const modalOpen = computed(() => store.getters['list/editTitleOpen']);
    const userInput = ref({
      notes: '',
      userRating: 5
    });

    const closeModal = () => {
      if(modalOpen.value) {
        // confirm unsaved changes!
        userInput.value = { notes: '', userRating: 5 };
        store.dispatch('list/toggleEditTitleModal', false);
      }
    };

    return {
      closeModal,
      editItem,
      modalOpen,
      userInput
    }
  }
}
</script>

<style lang="postcss" scoped>
  .list-edit-modal {
    @apply fixed top-0 left-0 right-0 z-20 bg-gray-200 rounded-lg shadow-lg mt-12 mx-auto py-6;
    width: calc(100% - 2rem);
  }
  @media(min-width:768px) {
    .list-edit-modal {
      @apply w-2/3;
    }
  }
  @media(min-width:1024px) {
    .list-edit-modal {
      @apply w-1/2 mt-0;
      top: 200px;
    }
  }
  @media(min-width:1440px) {
    .list-edit-modal {
      @apply max-w-xl;
    }
  }

  textarea {
    @apply w-full bg-gray-100 rounded-sm border border-transparent p-4;
    resize: none;
  }

  textarea:focus {
    @apply shadow-inner border-gray-400;
  }

  input[type=range] {
    @apply bg-transparent;
    -webkit-appearance: none;
  }

  input[type=range]:focus {
    outline: none;
  }

  input[type=range]::-webkit-slider-runnable-track {
    @apply shadow-md rounded bg-gray-600 cursor-pointer;
    height: 10px;
    animate: 0.2s;
  }

  input[type=range]::-webkit-slider-thumb {
    @apply shadow-md rounded-lg bg-gray-200 cursor-pointer border border-solid border-gray-600;
    height: 30px;
    width: 15px;
    -webkit-appearance: none;
    margin-top: -10px;
  }

  input[type=range]:focus::-webkit-slider-runnable-track {
    @apply bg-blue-700;
  }

  input[type=range]::-moz-range-track {
    @apply shadow-md rounded bg-gray-600 cursor-pointer;
    height: 10px;
    animate: 0.2s;
  }

  input[type=range]::-moz-range-thumb {
    @apply shadow-md rounded-lg bg-gray-200 cursor-pointer border border-solid border-gray-600;
    height: 30px;
    width: 15px;
  }

  input[type=range]:focus::-moz-range-track {
    @apply bg-blue-700;
  }
</style>