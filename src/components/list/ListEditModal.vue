<template>
  <div class="list-edit-modal">
    <div class="flex flex-row justify-between items-center px-8">
      <h3 class="text-gray-600 text-base mb-0">Edit Title: "{{ editItem.title }}"</h3>
      <button
        @click.prevent="closeModal()"
        class="font-bold text-gray-800 text-xl opacity-75 cursor-pointer hover:opacity-100 focus:outline-none"
      >×</button>
    </div>
    <div class="text-gray-800 pt-4 pb-2 px-8">
      <div class="mb-6">
        <h4>Date Watched</h4>
        <input v-model="editItem.userDateWatched" class="text-sm px-4 py-2 mb-6" type="date">
        <h4>Rating</h4>
        <InputRange v-model="editItem.userRating" />
        <p class="text-sm text-gray-600 mb-6">Your Rating: {{ editItem.userRating }}</p>
        <h4>Notes</h4>
        <textarea v-model="editItem.userNotes" class="p-4" name="notes" rows="5" placeholder="Notes, comments, etc."></textarea>
      </div>
      <div class="flex flex-row">
        <button
          @click.prevent="handleTitleEdit(editItem, mode)"
          class="btn btn-black mr-4"
          :class="{ 'bg-gray-700' : !saveBtnState.enabled }"
          :disabled="!saveBtnState.enabled"
        >
          {{ saveBtnState.text }}
        </button>
        <button @click.prevent="closeModal()" class="btn btn-muted">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import InputRange from '@/components/input/InputRange.vue';

export default {
  name: 'ListEditModal',
  components: {
    InputRange
  },
  props: {
    mode: String
  },
  setup(props) {
    const store = useStore();

    const editData = { userDateWatched: '', userNotes: '', userRating: 5 };
    const editItem = ref({});
    const modalOpen = computed(() => store.getters['list/editTitleOpen']);
    const saveBtnState = ref({ enabled: true, text: 'Save' });
    const srcItem = computed(() => store.getters['list/editTitleContent']);
    const writeSuccess = computed(() => store.getters['list/writeSuccess']);

    const closeModal = () => {
      if (hasChanges() && !writeSuccess.value) {
        if (confirm('Unsaved changes will be discarded.')) {
          store.dispatch('list/toggleEditTitleModal', false);
        }
      } else {
        store.dispatch('list/toggleEditTitleModal', false);
        store.dispatch('list/toggleWriteSuccess', false); // reset previous write success (if any); also used to notify the user about unsaved changes when closing the modal
      }
    };

    const handleTitleEdit = (data, mode) => {
      saveBtnState.value.enabled = false;
      saveBtnState.value.text = 'Saving...';

      switch (mode) {
        case 'tracklist':
          // update a title that's already in the tracklist
          store.dispatch('list/editListItem', data); // we'll get a toast message confirmation back
          break;
        case 'watchlist':
          // write the title + user input to the tracklist
          store.dispatch('list/writeList', [data, 'tracklist']); // we'll get a toast message confirmation back
          store.dispatch('list/deleteItem', [data.refId, 'watchlist', true]);
          break;
        default:
          return
      }
    }

    if (props.mode === 'watchlist') {
      editItem.value = { ...srcItem.value, ...editData };
    } else if (props.mode === 'tracklist') {
      editItem.value = { ...srcItem.value };
    }

    const hasChanges = () => {
      const current = editItem.value;
      // first check for watchlist items
      if (current.userDateWatched !== editData.userDateWatched || current.userNotes !== editData.userNotes || current.userRating !== editData.userRating) {
        // second check for tracklist items
        if (current.userDateWatched !== srcItem.value.userDateWatched || current.userNotes !== srcItem.value.userNotes || current.userRating !== srcItem.value.userRating) {
          return true
        }
      } else {
        return false
      }
    }

    watch(writeSuccess, () => {
      if (writeSuccess.value) {
        store.dispatch('list/toggleEditTitleModal', false); // close modal with user input only if successful
      }
    })

    return {
      closeModal,
      editItem,
      handleTitleEdit,
      saveBtnState
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
      top: 100px;
    }
  }
  @media(min-width:1440px) {
    .list-edit-modal {
      @apply max-w-xl;
    }
  }

  input[type=date],
  textarea {
    @apply w-full bg-gray-100 rounded-sm border border-transparent;
    resize: none;
  }

  input[type=date]:focus,
  textarea:focus {
    @apply shadow-inner border-gray-400;
  }
</style>