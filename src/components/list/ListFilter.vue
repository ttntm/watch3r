<script setup>
  import InputSelectNumber from '@/components/input/InputSelectNumber.vue'
  import { computed, ref, watch } from 'vue'
  import { useStore } from 'vuex'

  const props = defineProps({
    listLength: Number,
    mode: String
  })

  const store = useStore()

  const selected = ref()

  const allFilterModes = computed(() => store.getters['tools/filterMode'].filter(el => el.mode === 'all' || el.mode === props.mode))
  const filterCurrent = computed(() => store.getters[`tools/${props.mode}Filtered`])
  const filterEnabled = computed(() => store.getters['tools/filterEnabled'])
  const filterPreset = computed(() => store.getters['user/filterPreset'])
  const listMode = computed(() => props.mode)

  watch([listMode, filterCurrent], () => {
    // when navigating between list modes or when filters changes in another tab
    updateSelect()
  })

  const onSelectChange = (val) => {
    store.dispatch('tools/filterList', [val, props.mode])
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
  <InputSelectNumber
    :currentVal="selected"
    :data="allFilterModes"
    :disabled="filterEnabled === false || (filterCurrent <= 0 && listLength === 1) || listLength === 0"
    id="filter"
    :placeholder="`Filter ${mode}...`"
    :styles="{
      inner: 'w-full block appearance-none bg-transparent border border-transparent px-3 py-2 focus:border-yellow-600 focus:shadow-inner',
      wrapper: 'w-full relative text-gray-700 bg-gray-300 text-sm lg:text-base shadow-lg md:mx-4 lg:mx-8 mb-8 md:mb-0'
    }"
    @update:select="onSelectChange($event)"
  >
    <template #option="{ name }">
      {{ name }}
    </template>
  </InputSelectNumber>
</template>