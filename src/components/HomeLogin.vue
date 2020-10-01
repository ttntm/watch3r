<template>
  <div class="text-left bg-gray-400 text-gray-800 rounded-md shadow-lg border border-gray-700 px-12 py-10">
    <div class="login-input-group">
      <label for="login-email">Email</label>
      <input v-model="credentials.email" id="login-email" type="email" placeholder="jane@doe.com" required>
    </div>
    <div class="login-input-group">
      <label for="login-pwd">Password</label>
      <input v-model="credentials.password" @keyup.enter="handleLogin()" id="login-pwd" type="password" placeholder="************" required>
    </div>
    <button @click="handleLogin()" v-click-blur class="btn btn-black">Login</button>
    <p v-if="cValidateMsg !== ''" v-html="cValidateMsg" class="text-sm font-bold mt-6 mb-0" :class="{ 'text-red-500' : !validate() }" />
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HomeLogin',
  setup() {
    const store = useStore();

    const credentials = ref({ email: '', password: '' });
    const cValidateMsg = ref('');

    const validate = () => {
      const c = credentials.value;
      const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
      const valid = rx.test(c.email);
      if(!c.password || !c.email) {
        return false;
      } else if(c.password && c.email && valid) {
        return true;
      } else { return false; }
    }

    const handleLogin = () => {
      let msg = { text: '', type: ''};
      const spinner = require('@/assets/loading.svg');

      if(!validate()) {
        cValidateMsg.value = 'Please enter valid information.';
      } else {
        cValidateMsg.value = `<img src="${spinner}" class="mx-auto">`;
        store.dispatch('user/attemptLogin', credentials.value)
          .then(() => {
            msg.text = `You're logged in now`;
            msg.type =  'success';
            store.dispatch('app/sendToastMessage', msg);
            credentials.value = { email: '', password: '' };
            cValidateMsg.value = '';
          })
          .catch(error => {
            cValidateMsg.value = '';
            console.error(error, `Something's gone wrong logging in`);
            msg.text = `Something's gone wrong logging in, please try again later.`;
            msg.type =  'error';
            store.dispatch('app/sendToastMessage', msg);
          });
      }
    }

    return {
      credentials,
      cValidateMsg,
      handleLogin,
      validate
    }
  }
}
</script>

<style lang="postcss" scoped>
  .login-input-group {
    @apply flex flex-col w-full mb-6;
  }
  .login-input-group label {
    @apply text-gray-700 text-sm font-bold mb-2;
  }

  .login-input-group input {
    @apply bg-transparent border-b border-gray-500 px-2 py-1;
  }

  .login-input-group input:focus {
    @apply bg-gray-300 border-yellow-600 shadow-inner;
  }
</style>