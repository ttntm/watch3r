<template>
  <div class="flex flex-row items-center justify-center">
    <label class="btn btn-black inline-flex flex-row items-center justify-center cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-upload mr-1" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        <polyline points="7 9 12 4 17 9" />
        <line x1="12" y1="4" x2="12" y2="16" />
      </svg>
      <span class="pointer-events-none">Select File</span>
      <input
        @input="handleInput"
        class="hidden"
        type="file"
        accept=".csv"
      >
    </label>
    <p v-if="selected" v-html="selected" class="text-sm ml-4 mb-0" />
  </div>
</template>

<script>
import { ref } from 'vue';
import { validateExtension } from '@/helpers/shared.js';

export default {
  name: 'InputFile',
  setup(props, { emit }) {
    const selected = ref('');

    const handleInput = (e) => {
      const file = e.target.files[0]; //get the first file

      if (file && validateExtension(file.name)) {
        const reader = new FileReader();

        selected.value = `
          <strong>Selected</strong>: ${file.name}
        `;

        reader.onload = e => {
          emit('update:file', e.target.result);
        };

        reader.readAsText(file);
      } else {
        // abort if wrong file extension
        alert('Please select a CSV file.');
        return;
      }
    }

    return {
      handleInput,
      selected
    }
  }
}
</script>