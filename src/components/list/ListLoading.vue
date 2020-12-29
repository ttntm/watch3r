<template>
  <p @click="toImport" class="text-center text-lg mt-16" v-html="loadingState"></p>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ListLoading',
  setup() {
    const router = useRouter();

    const loadingState = ref('');
    const spinner = require('@/assets/loading.svg');

    const toImport = (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        router.push({ name: 'import' }); // Manually navigate to the route so router handles the link instead of reloading the page with a 'normal' <a>
      }
    }

    const setLoadingState = () => {
      let timer;

      clearTimeout(timer);

      loadingState.value = `<img src="${spinner}" class="mx-auto">`;

      timer = setTimeout(() => {
        loadingState.value = `
          Nothing here yet...
          <br /><br />
          Go ahead and use that "Add Title" button or <a href="/import" class="text-yellow-600 font-normal hover:underline focus:underline">import an IMDb list</a> 🤓
        `;
      }, 5000);
    }

    setLoadingState();

    return {
      loadingState,
      toImport
    }
  }
}
</script>
