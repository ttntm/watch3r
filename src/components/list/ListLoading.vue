<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const loadingState = ref('')

  const onMsgClick = (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault()
      router.push({ name: 'import' })
    }
  }

  const setLoadingState = () => {
    let timer

    clearTimeout(timer)

    loadingState.value = `<img src="/img/loading.svg" class="mx-auto">`

    timer = setTimeout(() => {
      loadingState.value = `
        Nothing here yet...
        <br /><br />
        Go ahead and use that "Add Title" button or <a href="/import" class="text-yellow-600 font-normal hover:underline focus:underline">import an IMDb list</a> 🤓
      `
    }, 5000)
  }

  setLoadingState()
</script>

<template>
  <p class="text-center text-lg mt-16" @click="onMsgClick" v-html="loadingState" />
</template>