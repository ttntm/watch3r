<template>
  <article class="card">
    <img :src="imgSrc" class="rounded-md" loading="lazy">
    <div class="card-overlay">
      <div class="flex flex-col">
        <h3 class="text-lg sm:text-2xl text-center text-yellow-600 mb-8">
          {{ titleDisplay }}
        </h3>
        <button
          v-click-blur
          class="card-btn click-outside-ignore"
          title="View Details"
          @click.prevent="exploreAdd()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-info-circle" width="45" height="45" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="8" x2="12.01" y2="8" />09
            <polyline points="11 12 12 12 12 16 13 16" />
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
  emits: ['add-title'],
  setup(props, { emit }) {
    const store = useStore();

    const imgSrc = computed(() => {
      // fallback for missing posters...
      return props.src ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${props.src}` : `/img/poster.jpg`
    });
    const recSource = computed(() => store.getters['explore/recSource']);

    const titleDisplay = computed(() => {
      return props.item.original_title ? props.item.original_title : props.item.original_name
    });

    const exploreAdd = () => {
      const titleData = {
        id: props.item.id,
        type: recSource.value.type
      };
      return emit('add-title', titleData);
    }

    return {
      exploreAdd,
      imgSrc,
      titleDisplay
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
    transform: scale(0.75);
    transition: all .35s ease;
  }

  .card:hover .card-overlay {
    @apply opacity-100;
    --bg-opacity: 0.95;
    transform: scale(1);
    transition: all .5s ease;
  }

  .card-btn {
    @apply bg-transparent text-yellow-600 border border-yellow-600 rounded-full mx-auto;
    border-width: 2px;
  }

  .card-btn:hover {
    @apply bg-yellow-600 text-gray-900;
  }
</style>