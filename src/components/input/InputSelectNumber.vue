<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    currentVal: Number,
    data: Array,
    id: String,
    placeholder: String,
    styles: Object
  })

  const emit = defineEmits(['update:select'])

  const selected = computed({
    get: () => props.currentVal,
    set: (val) => {
      emit('update:select', val)
    }
  })
</script>

<template>
  <div :class="styles.wrapper">
    <select :class="styles.inner" :id="`${id}-select`" v-model.lazy="selected" :name="id">
      <option disabled value="">
        {{ placeholder }}
      </option>
      <option v-for="(item, index) in data" :key="index" :value="index">
        <slot name="option" v-bind="item"></slot>
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg class="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
</template>