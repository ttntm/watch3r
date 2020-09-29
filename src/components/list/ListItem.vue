<template>
  <div class="list-item flex-col sm:flex-row">
    <div class="sm:self-center px-4">
      <img :src="item.image" class="poster self-center mb-4 sm:mb-0" :alt="item.title">
    </div>
    <div class="w-full sm:w-3/4 px-4 sm:px-6">
      <h3 class="mb-0">{{ item.title }}</h3>
      <p class="text-sm sm:mb-0">{{ item.plot }}</p>
    </div>
    <div class="w-full sm:w-1/4 self-center text-gray-700 text-sm px-4 sm:px-6 mb-4">
      <p>{{ item.genre }}</p>
      <p>Release: {{ item.year }}</p>
      <p class="sm:mb-0">Rating: {{ item.imdbRating }}</p>
    </div>
    <div class="flex flex-row sm:flex-col self-center px-4">
      <BtnListItemWatched v-if="mode === 'watchlist'" :mode="mode" class="mb-4" />
      <BtnListItemEdit v-if="mode === 'tracklist'" :mode="mode" class="mb-4" />
      <BtnListItemRemove :mode="mode" class="ml-4 sm:ml-0 mb-4" />
    </div>
  </div>
</template>

<script>
import BtnListItemEdit from '@/components/buttons/BtnListItemEdit.vue';
import BtnListItemRemove from '@/components/buttons/BtnListItemRemove.vue';
import BtnListItemWatched from '@/components/buttons/BtnListItemWatched.vue';
import { computed } from 'vue';

export default {
  name: 'ListItem',
  components: {
    BtnListItemEdit,
    BtnListItemRemove,
    BtnListItemWatched
  },
  props: {
    item: Object,
    mode: String,
  },
  setup(props) {

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