<template>
  <section>
    <p>Explore Recommendations</p>
    <BtnAddTitle />
    <button class="btn mt-4" @click="getRecommendations()">
      Test
    </button>
    <button class="btn mt-4" @click="addList()">
      Test 2
    </button>
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

    // TMDb posters -> https://image.tmdb.org/t/p/w600_and_h900_bestv2/wVbeL6fkbTKSmNfalj4VoAUUqJv.jpg -- same for movies and tv it seems

    const route = useRoute();
    const store = useStore();

    const fn = store.getters['app/functions'];

    const getRecommendations = () => {
      const data = {
        //id: 'tt0093773',
        //type: 'movie'
        id: 'tt5691552',
        type: 'series'
      }
      fetch(fn.tmdbGetRecs, { body: JSON.stringify(data), method: 'POST' })
        .then(response => {
          return response.json();
        })
        .then(res => {
          console.log(res);
        })
        .catch((error) => {
          console.error("TMDB API error", error);
        })
    }

    const addList = () => {
      const data = {
        id: '169', // Predator 2
        type: 'movie'
      }
      fetch(fn.tmdbToOmdb, { body: JSON.stringify(data), method: 'POST' })
        .then(response => {
          return response.json();
        })
        .then(res => {
          console.log(res);
        })
        .catch((error) => {
          console.error("TMDB API error", error);
        })
    }

    return {
      addList,
      getRecommendations,
      modalOpen: computed(() => store.getters['app/windowOpen'])
    }
  }
}
</script>

<style lang="postcss">

</style>