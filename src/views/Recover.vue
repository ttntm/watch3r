<script setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { validateEmail } from '@/helpers/shared.js'

  const router = useRouter()
  const store = useStore()

  const cred = reactive({ email: '' })

  const onSubmit = (o) => {
    if (validateEmail(cred.email)) {
      store.dispatch('user/requestPasswordRecovery', o)
      router.push({ name: 'home' })
    } else {
      alert('Please enter a valid email address...')
    }
  }
</script>

<template>
  <div id="recover" class="flex flex-grow items-center justify-items-center w-full h-full">
    <form
      id="recover-account-form"
      class="recover-box w-full max-w-full self-center px-12 py-10 mx-auto"
      @submit.prevent="onSubmit(cred.email)"
    >
      <h2 class="text-xl text-blue-800">Forgot Your Password?</h2>
      <p class="text-sm">Provide your email address and we'll send over instructions to reset your password.</p>
      <p class="text-sm">We do <em>not</em> store your password anywhere, so rest assured that we will never send and/or request your password via email.</p>
      <div class="input-group mb-8">
        <label for="email">Email Address</label>
        <p class="text-xs text-gray-600 mb-3">The email address associated with your account.</p>
        <input id="email" v-model="cred.email" type="email" class="text-gray-600" placeholder="forgotten@email.address">
      </div>
      <button v-click-blur type="submit" class="btn btn-black mr-auto" :disabled="!cred.email">Recover Account</button>
    </form>
  </div>
</template>

<style lang="postcss" scoped>
  .recover-box {
    @apply flex flex-col max-w-md bg-gray-400 text-gray-800 text-left rounded-md shadow-lg border border-gray-700;
  }
</style>