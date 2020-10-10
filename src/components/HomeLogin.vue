<template>
  <form
    id="login-form"
    @submit.prevent="handleLogin()"
    class="text-left bg-gray-400 text-gray-800 rounded-md shadow-lg border border-gray-700 px-12 py-10"
  >
    <div class="input-group">
      <label for="login-email">Email</label>
      <input v-model="credentials.email" id="login-email" type="email" placeholder="jane@doe.com">
    </div>
    <div class="input-group">
      <label for="login-pwd">Password</label>
      <input v-model="credentials.password" id="login-pwd" type="password" placeholder="************">
      <router-link :to="{name: 'recover'}" class="text-xs italic text-gray-600 hover:text-gray-800 mt-2 mb-0">
        Forgot your password?
      </router-link>
    </div>
    <button type="submit" class="btn btn-black" v-click-blur>Login</button>
    <p v-if="cValidateMsg !== ''" v-html="cValidateMsg" class="text-sm font-bold mt-6 mb-0" :class="{ 'text-red-500' : !validate() }" />
  </form>
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
            store.dispatch('user/setUserPrefs');
          })
          .catch(error => {
            cValidateMsg.value = '';
            console.error(`Something's gone wrong logging in`, error);
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
</style>