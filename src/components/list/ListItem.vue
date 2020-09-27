<template>
  <div class="list-item flex-col sm:flex-row">
    <div class="px-4">
      <img src="https://i.picsum.photos/id/392/200/300.jpg?hmac=tcnub3WKREnSOdoCn7rQtfZkHXNWn5fXwNpHrv0o-5k" class="block shadow mb-4 sm:mb-0" style="min-width: 100px; max-height: 200px;">
    </div>
    <div class="px-4 sm:px-6">
      <h3>Fancy Movie Title</h3>
      <p class="text-sm sm:mb-0">Plot - Nam non quam vel velit sagittis consequat non vel odio. Phasellus condimentum dictum orci, quis rhoncus lacus hendrerit non. Ut vel nisl lectus. Duis vitae varius enim. Morbi placerat urna sit amet sollicitudin viverra. Vivamus maximus metus ac ornare venenatis. Ut suscipit nec sapien ac fringilla.</p>
    </div>
    <div class="flex-shrink-0 text-gray-700 px-4 sm:px-6 mb-4">
      <p class="inline-block sm:block">Action, Drama</p>
      <span class="sm:hidden">&nbsp;|&nbsp;</span>
      <p class="inline-block sm:block text-sm">Rating: 7,7</p>
    </div>
    <div class="flex flex-row sm:flex-col px-4">
      <BtnListItemWatched v-if="mode === 'watch'" :mode="mode" class="mb-4" />
      <BtnListItemEdit v-if="mode === 'track'" :mode="mode" class="mb-4" />
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
    mode: String
  },
  setup(props) {

  }
}
</script>

<style lang="postcss" scoped>
  .list-item {
    @apply flex border-b border-gray-500 py-8 px-4;
  }
</style>