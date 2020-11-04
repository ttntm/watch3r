<template>
  <article class="card">
    <img :src="`https://image.tmdb.org/t/p/w600_and_h900_bestv2${src}`" class="rounded-md" loading="lazy">
    <div class="card-overlay">
      <div class="flex flex-col">
        <h3 class="text-center text-yellow-600 mb-8">{{ titleDisplay }}</h3>
        <button
          class="card-btn click-outside-ignore"
          title="Add to Watchlist"
          @click.prevent="toggleExploreAdd()"
          v-click-blur
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ExploreTitleCard',
  props: {
    item: Object,
    src: String
  },
  setup(props, { emit }) {
    const store = useStore();

    const exploreAddOpen = computed(() => store.getters['app/windowOpen'] === 5);
    const recSource = computed(() => store.getters['explore/recSource']);

    const titleDisplay = computed(() => {
      return props.item.original_title ? props.item.original_title : props.item.original_name
    });

    const toggleExploreAdd = () => {
      const titleData = {
        id: props.item.id,
        type: recSource.value.type
      };
      emit('add-title', titleData);
      return exploreAddOpen.value ? store.dispatch('app/toggleWindow', 0) : store.dispatch('app/toggleWindow', 5);
    }

    return {
      titleDisplay,
      toggleExploreAdd
    }
  }
}
</script>

<style lang="postcss" scoped>
  .card {
    @apply relative rounded-md shadow-lg;
  }

  .card-overlay {
    @apply absolute top-0 bottom-0 left-0 right-0 bg-gray-900 rounded-md bg-opacity-0 opacity-0 flex items-center justify-center p-4;
    transform: translateY(-50px);
    transition: all .5s ease;
  }

  .card:hover .card-overlay {
    @apply opacity-100;
    --bg-opacity: 0.95;
    transform: translateY(0px);
    transition: all .5s ease;
  }

  .card-btn {
    @apply bg-transparent text-yellow-600 border border-yellow-600 rounded-full p-2 mx-auto;
  }

  .card-btn:hover {
    @apply bg-yellow-600 text-gray-900;
  }
</style>