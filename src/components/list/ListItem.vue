<template>
  <article class="list-item flex-col sm:flex-row">
    <div class="sm:self-center px-4">
      <img
        :src="item.image"
        :alt="item.title"
        @click.self="$emit('open-poster', [item.image, item.title])"
        class="poster click-outside-ignore self-center cursor-pointer mb-6 sm:mb-0"
        loading="lazy"
        title="Click to enlarge"
      >
    </div>
    <div class="w-full sm:w-3/4 px-4 lg:px-6 self-center lg:self-start lg:py-2">
      <h3 class="text-xl mb-2">
        {{ item.title }}
        <a v-if="showIMDb" :href="`https://www.imdb.com/title/${item.id}`" target="_blank" rel="noopener" class="hidden lg:inline-block hover:shadow-outline focus:shadow-outline ml-1" title="View on IMDb">
          <img src="/img/imdb.png" alt="IMDb icon" class="w-4">
        </a>
      </h3>
      <p v-if="mode === 'tracklist' && item.userDateWatched" class="text-sm text-gray-600 mb-2">Watched: {{ item.userDateWatched }}</p>
      <p v-if="mode === 'tracklist' && item.userNotes" class="text-sm sm:mb-0">{{ item.userNotes }}</p>
      <p v-if="mode === 'watchlist' || !item.userNotes" class="text-sm sm:mb-0">{{ item.plot }}</p>
      <BtnListItemExplore v-if="showExplore && mode === 'tracklist'" :id="item.id" />
    </div>
    <div class="w-full sm:w-1/4 self-center text-gray-700 text-sm px-4 lg:px-6 mb-2 sm:mb-0">
      <p>{{ item.genre }}</p>
      <p>Release: {{ item.year }}</p>
      <p v-if="mode === 'tracklist' && item.userRating" class="sm:mb-0">Your Rating: {{ item.userRating }}</p>
      <p v-if="mode === 'watchlist' || !item.userRating" class="sm:mb-0">IMDb Rating: {{ item.imdbRating }}</p>
    </div>
    <div class="flex flex-row flex-wrap sm:flex-col self-center justify-center text-sm lg:text-base sm:px-4">
      <BtnListItemEdit v-if="mode === 'watchlist'" :id="item.refId" :mode="mode" class="sm:mb-4">
        Watched
      </BtnListItemEdit>
      <BtnListItemEdit v-if="mode === 'tracklist'" :id="item.refId" :mode="mode" class="sm:mb-4">
        Edit
      </BtnListItemEdit>
      <BtnListItemControls :id="item.refId" :mode="mode" :class="{ 'hidden' : !showExplore && !showIMDb }" class="ml-4 sm:ml-0 lg:hidden" />
      <BtnListItemRemove :id="item.refId" :mode="mode" :class="{ 'hidden' : showExplore || showIMDb }" class="ml-4 sm:ml-0 lg:flex" />
    </div>
  </article>
</template>

<script>
import BtnListItemControls from '@/components/buttons/BtnListItemControls.vue';
import BtnListItemEdit from '@/components/buttons/BtnListItemEdit.vue';
import BtnListItemExplore from '@/components/buttons/BtnListItemExplore.vue';
import BtnListItemRemove from '@/components/buttons/BtnListItemRemove.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListItem',
  components: {
    BtnListItemControls,
    BtnListItemEdit,
    BtnListItemExplore,
    BtnListItemRemove
  },
  props: {
    item: Object,
    mode: String,
  },
  setup() {
    const store = useStore();

    return {
      showExplore: computed(() => store.getters['user/showExploreLinks']),
      showIMDb: computed(() => store.getters['user/showIMDbLinks'])
    }
  }
}
</script>

<style lang="postcss" scoped>
  .list-item {
    @apply flex border-b border-gray-500 py-8 px-4;
  }

  .poster {
    @apply block shadow rounded-sm;
  }

  @media(max-width: 639px) {
    .poster {
      @apply w-full h-auto object-cover;
      max-height: 250px;
    }
  }

  @media(min-width: 640px) {
    .poster {
      min-width: 100px;
      width: 100px;
      max-height: 200px;
    }
  }

  .btn-imdb {
    @apply border border-yellow-600 text-yellow-600 shadow-none;
  }

  .btn-imdb:hover {
    @apply bg-gray-900 border-gray-900;
  }
</style>
