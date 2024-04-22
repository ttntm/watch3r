<script setup>
  import BtnClose from '@/components/buttons/BtnClose.vue'
  import InputRange from '@/components/input/InputRange.vue'
  import { computed, reactive, ref, watch } from 'vue'
  import { useStore } from 'vuex'
  import { getTimestamp, useDelay } from '@/helpers/shared'

  const props = defineProps({
    mode: String
  })

  const store = useStore()

  const { isVisible, toggleDelay } = useDelay()

  const editItem = ref({})
  const saveBtnState = reactive({ enabled: true, text: 'Save' })

  const searchActive = computed(() => store.getters['tools/searchActive'])
  const srcItem = computed(() => store.getters['list/editTitleContent'])
  const writeSuccess = computed(() => store.getters['list/writeSuccess'])

  watch(writeSuccess, () => {
    if (writeSuccess.value) {
      store.dispatch('app/toggleWindow', 0) // close modal with user input only if successful
    }
  })

  const editData = {
    userDateWatched: '',
    userNotes: '',
    userRating: '5'
  }

  const hasChanges = current => {
    const {
      userDateWatched,
      userNotes,
      userRating
    } = current

    switch (props.mode) {
      case 'tracklist':
        return userDateWatched !== srcItem.value.userDateWatched
          || userNotes !== srcItem.value.userNotes
          || userRating !== srcItem.value.userRating

      case 'watchlist':
        return userDateWatched !== editData.userDateWatched
          || userNotes !== editData.userNotes
          || userRating !== editData.userRating

      default:
        return false
    }
  }

  const events = {
    onClose() {
      if (hasChanges(editItem.value) && !writeSuccess.value) {
        if (confirm('Unsaved changes will be discarded.')) {
          store.dispatch('app/toggleWindow', 0)
        }
      } else {
        toggleDelay()
        setTimeout(() => store.dispatch('app/toggleWindow', 0), 100)
        store.dispatch('list/toggleWriteSuccess', false) // reset previous write success (if any); also used to notify the user about unsaved changes when closing the modal
      }

      store.dispatch('list/clearEditTitle')
    },

    onSave(data, mode) {
      saveBtnState.enabled = false
      saveBtnState.text = 'Saving...'

      switch (mode) {
        case 'tracklist':
          store.dispatch('list/editListItem', [data, mode])
          break

        case 'watchlist':
          store.dispatch('list/writeList', [data, 'tracklist'])
          store.dispatch('list/deleteItem', [data.refId, mode, true])
          break
      }

      if (searchActive.value) {
        // update DB data and also update displayed data (so search results do not reset)
        store.dispatch('list/updateSearchResult', data)
      }
    }
  }

  if (props.mode === 'tracklist') {
    editItem.value = { ...srcItem.value }

    if (!editItem.value.userDateWatched) {
      editItem.value.userDateWatched = getTimestamp()
    }

    if (!editItem.value.userRating) {
      editItem.value.userRating = editData.userRating
    }
  }

  if (props.mode === 'watchlist') {
    editItem.value = { ...srcItem.value, ...editData }

    // Item is coming from watchlist:
    //   1) set today as `userDateWatched` - see: #62
    editItem.value.userDateWatched = getTimestamp()

    //   2) get rid of "watching" marker - see: #52
    if (editItem.value.watching) {
      delete editItem.value['watching']
    }
  }

  store.dispatch('list/toggleWriteSuccess', false) // cleanup
</script>

<template>
  <transition name="modal">
    <section v-if="isVisible" v-esc="events.onClose" v-scroll-lock class="list-modal" role="dialog" aria-labelledby="edit-modal-heading">
      <section class="flex flex-row justify-between items-center px-6 sm:px-8">
        <h3 id="edit-modal-heading" class="text-gray-600 text-base mb-0">
          Edit Title: "{{ editItem.title }}"
        </h3>
        <BtnClose btn-title="Close" @click="events.onClose" />
      </section>
      <form
        id="edit-form"
        class="text-gray-800 pt-4 pb-2 px-6 sm:px-8"
        @submit.prevent
      >
        <div class="mb-6">
          <h4>Date Watched</h4>
          <input v-model="editItem.userDateWatched" class="text-sm text-gray-600 px-4 py-2 mb-6" type="date">
          <h4>Rating</h4>
          <InputRange v-model="editItem.userRating" />
          <p class="text-sm text-gray-600 mb-6">
            Your Rating: {{ editItem.userRating }}
          </p>
          <h4>Notes</h4>
          <textarea v-model="editItem.userNotes" class="text-sm px-4 py-2" name="notes" rows="5" placeholder="Notes, comments, etc." />
        </div>
        <div class="flex flex-row">
          <button
            class="btn btn-black mr-4"
            :class="{ 'bg-gray-700' : !saveBtnState.enabled }"
            :disabled="!saveBtnState.enabled"
            @click.prevent="events.onSave(editItem, mode)"
          >
            {{ saveBtnState.text }}
          </button>
          <button class="btn btn-muted" @click.prevent="events.onClose">
            Cancel
          </button>
        </div>
      </form>
    </section>
  </transition>
</template>

<style lang="postcss" scoped>
  input[type=date],
  textarea {
    @apply w-full bg-gray-100 rounded-sm border border-transparent;
    resize: none;
  }

  input[type=date] {
    height: 40px;
    min-height: 40px;
  }

  input[type=date]:focus,
  textarea:focus {
    @apply shadow-inner border-gray-400;
  }

  @supports (-webkit-touch-callout: none) {
    input[type=date] {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      min-width: 100%;
    }
  }
</style>