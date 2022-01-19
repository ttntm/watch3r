<script setup>
  import { computed, ref, watch } from 'vue'
  import { useStore } from 'vuex'

  const props = defineProps({
    mode: String
  })

  const store = useStore()

  const selected = ref()

  const allSortModes = computed(() => store.getters['tools/sortMode'])
  const listMode = computed(() => props.mode)
  const sortCurrent = computed(() => store.getters[`tools/${props.mode}Sorted`])
  const sortPreset = computed(() => store.getters[`user/sortPreset`])

  watch([listMode, sortCurrent], () => {
    // when navigating between list modes or when sorting changes in another tab
    updateSelect()
  })

  const onSelectChange = (val) => {
    store.dispatch('tools/sortList', [val, props.mode])
    document.getElementById('sort-select').blur()
  }

  const updateSelect = () => {
    if (sortCurrent.value === -1) {
      selected.value = sortPreset.value
    } else {
      selected.value = sortCurrent.value
    }
  }

  updateSelect()
</script>

<template>
  <section class="w-full relative text-gray-700 bg-gray-300 shadow-lg sm:ml-8">
    <select id="sort-select" v-model="selected" name="sorting" @change="onSelectChange(selected)">
      <option disabled value="">
        Sort {{ mode }}...
      </option>
      <option v-for="(sortMode, index) in allSortModes" :key="index" :value="index" class="">
        {{ sortMode.name }} ({{ sortMode.order }})
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg class="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
  select, select option {
    @apply capitalize;
  }

  #sort-select {
    @apply w-full block appearance-none bg-transparent border border-transparent px-3 py-2;
  }

  #sort-select:focus {
    @apply border-yellow-600 shadow-inner;
  }
</style>