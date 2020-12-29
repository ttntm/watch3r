<template>
  <article class="list-item flex-col sm:flex-row">
    <div class="w-full sm:w-1/2 px-4 lg:px-6 self-center lg:self-start lg:py-2">
      <h3 class="text-lg mb-2">
        {{ item.Title }}
        <a v-if="showIMDb" :href="`https://www.imdb.com/title/${item.Const}`" target="_blank" rel="noopener" class="hidden lg:inline-block hover:shadow-outline focus:shadow-outline ml-1" title="View on IMDb">
          <img src="/img/imdb.png" alt="IMDb icon" class="w-4">
        </a>
      </h3>
      <p class="text-sm sm:mb-0">{{ item.Genres }}</p>
    </div>
    <div class="w-full sm:w-1/4 self-center text-gray-700 text-sm px-4 lg:px-6 mb-2 sm:mb-0">
      <p>Release: {{ item.Year }}</p>
      <p class="sm:mb-0">IMDb Rating: {{ item["IMDb Rating"] }}</p>
    </div>
    <div class="sm:w-1/4 flex flex-row flex-wrap sm:flex-col self-center justify-center text-sm lg:text-base sm:px-4">
      <button
        v-if="!duplicate"
        @click.prevent="importAdd()"
        class="btn btn-black click-outside-ignore"
        v-click-blur
      >
        &plus; <span class="capitalize pointer-events-none">{{ mode }}</span>
      </button>
      <p v-else class="text-center mb-0">Added &#10003;</p>
    </div>
  </article>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { checkDuplicate } from '@/helpers/shared.js';

export default {
  name: 'ListItemImport',
  components: {},
  props: {
    item: Object,
    mode: String,
  },
  setup(props, { emit }) {
    const store = useStore();

    const duplicate = ref(false);
    const list = computed(() => store.getters[`list/${props.mode}`]);
    const mode = computed(() => props.mode);

    const importAdd = () => {
      const titleData = {
        prefix: 'i',
        query: props.item.Const
      };
      return emit('import-title', titleData);
    }

    const isDuplicate = () => { return checkDuplicate(mode.value, props.item.Const).length > 0 ? true : false }

    watch(list, () => {
      if (list.value.length > 0) {
        duplicate.value = isDuplicate();
      }
    })

    watch(mode, () => {
      duplicate.value = isDuplicate();
    })

    duplicate.value = isDuplicate();

    return {
      duplicate,
      importAdd,
      showIMDb: computed(() => store.getters['user/showIMDbLinks'])
    }
  }
}
</script>

<style lang="postcss" scoped>
  .btn-imdb {
    @apply border border-yellow-600 text-yellow-600 shadow-none;
  }

  .btn-imdb:hover {
    @apply bg-gray-900 border-gray-900;
  }
</style>