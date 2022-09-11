<script setup>
  import { computed, ref, watch } from 'vue'
  import { useStore } from 'vuex'

  const props = defineProps({
    mode: String
  })

  const store = useStore()

  const selected = ref()

  const allFilterModes = computed(() => store.getters['tools/filterMode'])
  const filterCurrent = computed(() => store.getters[`tools/${props.mode}Filtered`])
  const filterPreset = computed(() => store.getters['user/filterPreset'])
  const listMode = computed(() => props.mode)

  watch([listMode, filterCurrent], () => {
    // when navigating between list modes or when filters changes in another tab
    updateSelect()
  })

  const onSelectChange = (val) => {
    // store.dispatch('tools/filterList', [val, props.mode])
    document.getElementById('filter-select').blur()
  }

  const updateSelect = () => {
    if (filterCurrent.value === -1) {
      selected.value = filterPreset.value
    } else {
      selected.value = filterCurrent.value
    }
  }

  updateSelect()
</script>

<template>
  <section class="w-full relative text-gray-700 bg-gray-300 shadow-lg sm:mx-8 mb-8 sm:mb-0">
    <select id="filter-select" v-model="selected" name="filter" @change="onSelectChange(selected)">
      <option disabled value="">
        Filter {{ mode }}...
      </option>
      <option v-for="(filterMode, index) in allFilterModes" :key="index" :value="index" class="">
        {{ filterMode.name }}
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

  #filter-select {
    @apply w-full block appearance-none bg-transparent border border-transparent px-3 py-2;
  }

  #filter-select:focus {
    @apply border-yellow-600 shadow-inner;
  }
</style>