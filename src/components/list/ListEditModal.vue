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
    user_date_watched: '',
    user_notes: '',
    user_rating: '5'
  }

  const hasChanges = current => {
    const {
      user_date_watched,
      user_notes,
      user_rating
    } = current

    switch (props.mode) {
      case 'tracklist':
        return user_date_watched !== srcItem.value.user_date_watched
          || user_notes !== srcItem.value.user_notes
          || user_rating !== srcItem.value.user_rating

      case 'watchlist':
        return user_date_watched !== editData.user_date_watched
          || user_notes !== editData.user_notes
          || user_rating !== editData.user_rating

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

      // set `updated` date
      data.updated = (new Date()).toISOString()

      switch (mode) {
        case 'tracklist':
          store.dispatch('list/editListItem', [data, mode])
          break

        case 'watchlist':
          store.dispatch('list/writeList', [data, 'tracklist'])
          store.dispatch('list/deleteItem', [data.id, mode, true])
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

    if (!editItem.value.user_date_watched) {
      editItem.value.user_date_watched = getTimestamp()
    }

    if (!editItem.value.user_rating) {
      editItem.value.user_rating = editData.user_rating
    }
  }

  if (props.mode === 'watchlist') {
    editItem.value = { ...srcItem.value, ...editData }

    // Item is coming from watchlist:
    //   1) set today as `user_date_watched` - see: #62
    editItem.value.user_date_watched = getTimestamp()

    //   2) get rid of "watching" marker - see: #52
    delete editItem.value['watching']
  }

  store.dispatch('list/toggleWriteSuccess', false) // cleanup
</script>

<template>
  <transition name="modal">
    <div v-if="isVisible" v-esc="events.onClose" v-scroll-lock class="list-modal" role="dialog" aria-labelledby="edit-modal-heading">
      <div class="flex flex-row justify-between items-center px-6 sm:px-8">
        <h3 id="edit-modal-heading" class="text-gray-600 text-base mb-0">
          Edit Title: "{{ editItem.title }}"
        </h3>
        <BtnClose btn-title="Close" @click="events.onClose" />
      </div>
      <form
        id="edit-form"
        class="text-gray-800 pt-4 pb-2 px-6 sm:px-8"
        @submit.prevent
      >
        <div class="mb-6">
          <h4>Date Watched</h4>
          <input v-model="editItem.user_date_watched" class="text-sm text-gray-600 px-4 py-2 mb-6" type="date">
          <h4>Rating</h4>
          <InputRange v-model="editItem.user_rating" />
          <p class="text-sm text-gray-600 mb-6">
            Your Rating: {{ editItem.user_rating }}
          </p>
          <h4>Notes</h4>
          <textarea v-model="editItem.user_notes" class="text-sm px-4 py-2" name="notes" rows="5" placeholder="Notes, comments, etc." />
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
    </div>
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