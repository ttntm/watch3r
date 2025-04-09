<script setup>
  import BtnIMDb from '@/components/buttons/BtnIMDb.vue'
  import BtnListItemControls from '@/components/buttons/BtnListItemControls.vue'
  import BtnListItemEdit from '@/components/buttons/BtnListItemEdit.vue'
  import BtnListItemExplore from '@/components/buttons/BtnListItemExplore.vue'
  import BtnListItemRemove from '@/components/buttons/BtnListItemRemove.vue'
  import BtnListItemWatching from '@/components/buttons/BtnListItemWatching.vue'

  const props = defineProps({
    item: Object,
    mode: String,
    showExplore: Boolean,
    showIMDb: Boolean,
    showWatching: Boolean,
  })

  const emit = defineEmits(['open-poster'])
</script>

<template>
  <div class="sm:self-center px-4">
    <UnLazyImage
      :src-set="item.image"
      :alt="item.title"
      class="poster click-outside-ignore self-center cursor-pointer h-full mb-6 sm:mb-0"
      title="Click to enlarge"
      placeholder-src="/img/blurred.png"
      auto-sizes
      @click.self="$emit('open-poster', [item.image, item.title])"
    />
  </div>
  <div class="w-full sm:w-3/4 px-4 lg:px-6 self-center">
    <h3 class="text-xl mb-2">
      {{ item.title }}
      <BtnIMDb
        v-if="showIMDb"
        :id="item.imdb_id"
        class="hidden lg:inline-block ml-1"
      />
    </h3>
    <p v-if="mode === 'tracklist' && item.user_date_watched" class="text-sm text-gray-600 mb-2">
      Watched: {{ item.user_date_watched }}
    </p>
    <p v-if="mode === 'watchlist' && showWatching && item.watching" class="flex flex-row items-center text-sm font-bold text-yellow-600 mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-movie mr-1" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentcolor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <line x1="8" y1="4" x2="8" y2="20" />
        <line x1="16" y1="4" x2="16" y2="20" />
        <line x1="4" y1="8" x2="8" y2="8" />
        <line x1="4" y1="16" x2="8" y2="16" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="16" y1="8" x2="20" y2="8" />
        <line x1="16" y1="16" x2="20" y2="16" />
      </svg>
      Currently watching
    </p>
    <p v-if="mode === 'tracklist' && item.user_notes" class="text-sm sm:mb-0">
      {{ item.user_notes }}
    </p>
    <p v-if="mode === 'watchlist' || !item.user_notes" class="text-sm sm:mb-0">
      {{ item.plot }}
    </p>
    <BtnListItemExplore
      v-if="showExplore && mode === 'tracklist'"
      :id="item.imdb_id"
    />
    <BtnListItemWatching
      v-if="showWatching && item.type === 'series' && mode === 'watchlist'"
      :item="item"
      :watching="item.watching"
    />
  </div>
  <div class="w-full sm:w-1/4 self-center text-gray-700 text-sm px-4 lg:px-6 mb-2 sm:mb-0">
    <p>{{ item.genre }}</p>
    <p>Release: {{ item.year }}</p>
    <p v-if="mode === 'tracklist' && item.user_rating" class="sm:mb-0">
      Your Rating: {{ item.user_rating }}
    </p>
    <p v-if="mode === 'watchlist' || !item.user_rating" class="sm:mb-0">
      IMDb Rating: {{ item.imdb_rating }}
    </p>
  </div>
  <div class="flex flex-row flex-wrap sm:flex-col self-center justify-center text-sm lg:text-base sm:px-4">
    <BtnListItemEdit
      :id="item.id"
      :mode="mode"
      class="sm:mb-4"
    />
    <BtnListItemControls
      :id="item.id"
      :mode="mode"
      :class="{ 'hidden' : !showExplore && !showIMDb }"
      class="ml-4 sm:ml-0 lg:hidden"
    />
    <BtnListItemRemove
      :id="item.id"
      :mode="mode"
      :class="{ 'hidden' : showExplore || showIMDb }"
      class="ml-4 sm:ml-0 lg:flex"
    />
  </div>
</template>

<style lang="postcss" scoped>
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