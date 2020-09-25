<template>
  <div class="flex flex-grow items-center justify-items-center w-full h-full">
    <div class="text-center self-center max-w-full md:max-w-sm mx-auto">
      <div class="mb-12">
        <h1 class="text-3xl text-yellow-600">Signup</h1>
        <p>Please choose a password for your account.</p>
      </div>
      <div class="text-left bg-gray-400 text-gray-800 rounded-md shadow-lg border border-gray-700 px-12 py-10">
        <div class="signup-input-group">
          <label for="signup-pwd">Password</label>
          <input v-model="pwd" @keyup.enter="handleSignup(pwd)" id="signup-pwd" type="password" placeholder="************" required>
        </div>
        <button @click="handleSignup(pwd)" class="btn btn-black">Signup</button>
        <p v-if="status" v-html="status" class="text-sm font-bold mt-6 mb-0" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'Signup',
  setup() {
    const route = useRoute();
    const store = useStore();

    const msg = ref({ text: '', type: ''});
    const pwd = ref('');
    const status = ref('');
    const token = computed(() => route.query.t);

    const validate = () => {
      if(!token.value) {
        msg.value.text = 'Invalid token...';
        msg.value.type = 'error';
        return false;
      } else if(pwd.value.length < 6) {
        msg.value.text = 'Please choose a more secure password';
        msg.value.type = 'error';
        return false;
      } else {
        return true;
      }
    };

    const handleSignup = (pwd) => {
      msg.value = { text: '', type: ''};
      status.value = '';
      if(validate()) {
        console.log(`you entered: ${pwd}`);
        status.value = `Processing...`;
        store.dispatch('user/processInvite', { token: token.value, pwd: pwd });
      } else {
        console.error(msg.value.text);
      }
    };

    return {
      handleSignup,
      msg,
      pwd,
      status,
      token
    }
  }
}
</script>

<style lang="postcss" scoped>
  .signup-input-group {
    @apply flex flex-col w-full mb-6;
  }
  .signup-input-group label {
    @apply text-gray-700 text-sm font-bold mb-2;
  }

  .signup-input-group input {
    @apply bg-transparent border-b border-gray-500 px-2 py-1;
  }

  .signup-input-group input:focus {
    @apply bg-gray-300 border-yellow-600 rounded-sm shadow-inner;
  }
</style>