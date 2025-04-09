<script setup>
  import { computed, ref, watch } from 'vue'
  import { useStore } from 'vuex'
  import { checkDuplicate } from '@/helpers/shared.js'

  import BtnIMDb from '@/components/buttons/BtnIMDb.vue'

  const props = defineProps({
    item: Object,
    mode: String
  })

  const emit = defineEmits(['import-title'])

  const store = useStore()

  const duplicate = ref(false)

  const list = computed(() => store.getters[`list/${props.mode}`])
  const mode = computed(() => props.mode)
  const showIMDb = computed(() => store.getters['user/showIMDbLinks'])

  watch([list, mode], () => {
    if (list.value.length > 0) {
      duplicate.value = isDuplicate()
    }
  })

  const isDuplicate = () => {
    return checkDuplicate(mode.value, props.item.Const) > -1
  }

  const onImportAdd = () => emit('import-title', { prefix: 'i', query: props.item.Const })

  duplicate.value = isDuplicate()
</script>

<template>
  <article class="list-item flex-col sm:flex-row">
    <div class="w-full sm:w-1/2 px-4 lg:px-6 self-center lg:self-start lg:py-2">
      <h3 class="text-lg mb-2">
        {{ item.Title }}
        <BtnIMDb v-if="showIMDb" :id="item.Const" class="hidden lg:inline-block ml-1" />
      </h3>
      <p class="text-sm sm:mb-0">
        {{ item.Genres }}
      </p>
    </div>
    <div class="w-full sm:w-1/4 self-center text-gray-700 text-sm px-4 lg:px-6 mb-2 sm:mb-0">
      <p>Release: {{ item.Year }}</p>
      <p class="sm:mb-0">
        IMDb Rating: {{ item["IMDb Rating"] }}
      </p>
    </div>
    <div class="sm:w-1/4 flex flex-row flex-wrap sm:flex-col self-center justify-center text-sm lg:text-base sm:px-4">
      <button
        v-if="!duplicate"
        v-click-blur
        class="btn btn-black click-outside-ignore"
        @click.prevent="onImportAdd()"
      >
        &plus; <span class="capitalize pointer-events-none">{{ mode }}</span>
      </button>
      <p v-else class="text-center mb-0">
        Added &#10003;
      </p>
    </div>
  </article>
</template>

<style lang="postcss" scoped>
  .btn-imdb {
    @apply border border-yellow-600 text-yellow-600 shadow-none;
  }

  .btn-imdb:hover {
    @apply bg-gray-900 border-gray-900;
  }
</style>