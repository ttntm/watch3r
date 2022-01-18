<script setup>
  import { ref } from 'vue'
  import { validateExtension } from '@/helpers/shared.js'

  const emit = defineEmits(['update:file'])

  const selected = ref('')

  const onInput = (e) => {
    const file = e.target.files[0] //get the first file

    if (!file || !validateExtension(file.name)) {
      return alert('Please select a CSV file.')
    }

    const reader = new FileReader()

    selected.value = `<strong>Selected</strong>: ${file.name}`

    reader.onload = e => emit('update:file', e.target.result)

    reader.readAsText(file)
  }
</script>

<template>
  <div class="flex flex-row items-center justify-center">
    <label class="btn btn-black inline-flex flex-row items-center justify-center cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-upload mr-1" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        <polyline points="7 9 12 4 17 9" />
        <line x1="12" y1="4" x2="12" y2="16" />
      </svg>
      <span class="pointer-events-none">Select File</span>
      <input
        class="hidden"
        type="file"
        accept=".csv"
        @input="onInput"
      >
    </label>
    <p v-if="selected" class="text-sm ml-4 mb-0" v-html="selected" />
  </div>
</template>