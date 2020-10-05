<template>
  <div class="list-item flex-col sm:flex-row">
    <div class="sm:self-center px-4">
      <img :src="item.image" class="poster self-center mb-4 sm:mb-0" :alt="item.title" loading="lazy">
    </div>
    <div class="w-full sm:w-3/4 px-4 sm:px-6">
      <h3 class="mb-2">
        {{ item.title }}
        <a :href="`https://www.imdb.com/title/${item.id}`" target="_blank" rel="noopener" class="inline-block ml-1" title="View on IMDb">
          <img :src="imdbIcon" alt="IMDb icon" class="w-5">
        </a>
      </h3>
      <p v-if="mode === 'tracklist' && item.userDateWatched" class="text-sm text-gray-600 mb-2">Watched: {{ item.userDateWatched }}</p>
      <p v-if="mode === 'tracklist' && item.userNotes" class="text-sm sm:mb-0">{{ item.userNotes }}</p>
      <p v-if="mode === 'watchlist' || !item.userNotes" class="text-sm sm:mb-0">{{ item.plot }}</p>
    </div>
    <div class="w-full sm:w-1/4 self-center text-gray-700 text-sm px-4 sm:px-6 mb-4">
      <p>{{ item.genre }}</p>
      <p>Release: {{ item.year }}</p>
      <p v-if="mode === 'tracklist' && item.userRating" class="sm:mb-0">Your Rating: {{ item.userRating }}</p>
      <p v-if="mode === 'watchlist' || !item.userRating" class="sm:mb-0">IMDb Rating: {{ item.imdbRating }}</p>
    </div>
    <div class="flex flex-row sm:flex-col self-center px-4">
      <BtnListItemEdit v-if="mode === 'watchlist'" :id="item.refId" :mode="mode" class="mb-4">
        Watched
      </BtnListItemEdit>
      <BtnListItemEdit v-if="mode === 'tracklist'" :id="item.refId" :mode="mode" class="mb-4">
        Edit
      </BtnListItemEdit>
      <BtnListItemRemove :id="item.refId" :mode="mode" class="ml-4 sm:ml-0 mb-4" />
    </div>
  </div>
</template>

<script>
import BtnListItemEdit from '@/components/buttons/BtnListItemEdit.vue';
import BtnListItemRemove from '@/components/buttons/BtnListItemRemove.vue';
import { computed } from 'vue';

export default {
  name: 'ListItem',
  components: {
    BtnListItemEdit,
    BtnListItemRemove
  },
  props: {
    item: Object,
    mode: String,
  },
  setup() {
    const imdbIcon = computed(() => {
      return require('@/assets/imdb.png');
    });

    return {
      imdbIcon
    }
  }
}
</script>

<style lang="postcss" scoped>
  .list-item {
    @apply flex border-b border-gray-500 py-8 px-4;
  }
  .poster {
    @apply block shadow;
    min-width: 100px;
    width: 100px;
    max-height: 200px;
  }
</style>