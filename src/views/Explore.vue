<template>
  <section>
    <p>Explore Recommendations</p>
    <BtnAddTitle />
  </section>
  <!-- MODALS -->
  <transition name="modal">
    <ListAddModal v-if="modalOpen === 2" mode="watchlist" />
  </transition>
  <!-- OVERLAY -->
  <ModalBackdrop />
</template>

<script>
import BtnAddTitle from '@/components/buttons/BtnAddTitle.vue';
import ListAddModal from '@/components/list/ListAddModal.vue';
import ModalBackdrop from '@/components/ModalBackdrop.vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'Explore',
  components: {
    BtnAddTitle,
    ListAddModal,
    ModalBackdrop
  },
  setup() {
    // check route for IMDb ID
      // if NOT found, check tracklist length
        // if 0, load tracklist
      // if found, load recommendations based on IMDb ID

    // with tracklist -> display a select box (?) or some list to select a title to base recommendations on

    // include AddTitleModal -> each recommendation should use that to trigger a pre-set OMDb search based on the recommendations' IMDB ID
      // need to refine the button that opens the modal -> make it a slotted button, style differently...?
      // need to implement the logic to handle specific recommendations, i.e. auto-switch to ID search mode and immediately perform search onCreated()

    const route = useRoute();
    const store = useStore();

    return {
      modalOpen: computed(() => store.getters['app/windowOpen'])
    }
  }
}
</script>

<style lang="postcss">

</style>