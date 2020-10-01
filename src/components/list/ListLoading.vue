<template>
  <p class="text-center text-lg mt-16" v-html="loadingState"></p>
</template>

<script>
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'ListLoading',
  setup() {
    const loadingState = ref('');
    const spinner = require('@/assets/loading.svg');

    const setLoadingState = () => {
      let timer;

      clearTimeout(timer);

      loadingState.value = `<img src="${spinner}" class="mx-auto">`;

      timer = setTimeout(() => {
        loadingState.value = `
          Nothing here yet...
          <br /><br />
          Go ahead and use that "Add Title" button 🤓
        `;
      }, 2500);
    }

    onMounted(() => {
      setLoadingState();
    })

    return {
      loadingState
    }
  }
}
</script>

<style>

</style>