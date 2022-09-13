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

  const allSortModes = computed(() => store.getters['tools/sortMode'])
  const listMode = computed(() => props.mode)
  const sortCurrent = computed(() => store.getters[`tools/${props.mode}Sorted`])
  const sortPreset = computed(() => store.getters['user/sortPreset'])

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
  <InputSelectNumber
    :currentVal="selected"
    :data="allSortModes"
    :disabled="listLength === 0"
    id="sort"
    :placeholder="`Sort ${mode}...`"
    :styles="{
      inner: 'w-full block appearance-none bg-transparent border border-transparent px-3 py-2 focus:border-yellow-600 focus:shadow-inner',
      wrapper: 'w-full relative text-gray-700 bg-gray-300 text-sm lg:text-base shadow-lg md:ml-4 lg:ml-8'
    }"
    @update:select="onSelectChange($event)"
  >
    <template #option="{ name, order }">
      {{ name }} ({{ order }})
    </template>
  </InputSelectNumber>
</template>