<template>
  <div id="recover" class="flex flex-grow items-center justify-items-center w-full h-full">
    <form
      id="recover-account-form"
      onsubmit="return false"
      class="recover-box w-full max-w-full self-center p-8 mx-auto"
    >
      <h2 class="text-xl text-blue-800">Forgot Your Password?</h2>
      <p class="text-sm">Please your email address and we'll send instructions to reset your password.</p>
      <p class="text-sm">We do <em>not</em> store your password anywhere, so rest assured that we will never send and/or request your password via email.</p>
      <div class="input-group mb-8">
        <label for="email">Email Address</label>
        <p class="text-xs text-gray-600 mb-3">The email address associated with your account.</p>
        <input v-model="cred.email" id="email" type="email" class="text-gray-600" placeholder="forgotten@email.address">
      </div>
      <button class="btn btn-black mr-auto" @click="handleRecover(cred.email)">Recover Account</button>
    </form>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Recover',
  setup() {
    const store = useStore();

    const cred = ref({ email: '' });

    const handleRecover = (o) => {
      store.dispatch('user/requestPasswordRecover', o);
    }

    return {
      cred,
      handleRecover
    }
  }
}
</script>

<style lang="postcss" scoped>
  .recover-box {
    @apply flex flex-col max-w-md bg-gray-400 text-gray-800 text-left rounded-md shadow-lg border border-gray-700;
  }
</style>