<template>
  <div id="invite" class="flex flex-grow items-center justify-items-center w-full h-full">
    <form
      id="invite-form"
      @submit.prevent
      class="invite-box w-full max-w-full self-center px-12 py-10 mx-auto"
    >
      <h2 class="text-xl text-blue-800">Request an Invite</h2>
      <p class="text-sm">Some text...</p>
      <div class="input-group mb-8">
        <label for="email">Email Address</label>
        <input v-model="cred.email" id="email" type="email" class="text-gray-600" placeholder="hello@watch3r.app">
      </div>
      <button class="btn btn-black mr-auto" @click="handleInvite(cred.email)" v-click-blur>Request Invite</button>
    </form>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'Recover',
  setup() {
    const router = useRouter();
    const store = useStore();

    const cred = ref({ email: '' });
    const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
    const valid = computed(() => rx.test(cred.value.email));

    const handleInvite = (o) => {
      if (valid.value) {
        console.log('inviting...');
      } else {
        alert('Please enter a valid email address...');
      }
    }

    return {
      cred,
      handleInvite
    }
  }
}
</script>

<style lang="postcss" scoped>
  .invite-box {
    @apply flex flex-col max-w-md bg-gray-400 text-gray-800 text-left rounded-md shadow-lg border border-gray-700;
  }
</style>