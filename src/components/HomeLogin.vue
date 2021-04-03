<template>
  <form
    id="login-form"
    class="text-left bg-gray-400 text-gray-800 rounded-md shadow-lg border border-gray-700 px-12 py-10"
    @submit.prevent="handleLogin()"
  >
    <div class="input-group">
      <label for="login-email">Email</label>
      <input id="login-email" v-model="credentials.email" type="email" placeholder="jane@doe.com" @input="clearValidate()">
    </div>
    <div class="input-group">
      <label for="login-pwd">Password</label>
      <input id="login-pwd" v-model="credentials.password" type="password" placeholder="************" @input="clearValidate()">
      <router-link :to="{name: 'recover'}" class="text-xs italic text-gray-600 hover:text-gray-800 mt-2 mb-0">
        Forgot your password?
      </router-link>
    </div>
    <button v-click-blur type="submit" class="btn btn-black" :disabled="!credentials.email || !credentials.password">
      Login
    </button>
    <transition name="loading">
      <p v-if="cValidateMsg !== ''" class="text-sm font-bold mt-6 mb-0" :class="{ 'text-red-500' : !validate() }" v-html="cValidateMsg" />
    </transition>
  </form>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { validateEmail } from '../helpers/shared.js';

export default {
  name: 'HomeLogin',
  setup() {
    const store = useStore();

    const credentials = ref({ email: '', password: '' });
    const cValidateMsg = ref('');

    const clearValidate = () => { cValidateMsg.value = '' }

    const validate = () => {
      const c = credentials.value;

      if(!c.password || !c.email) {
        return false;
      } else if(c.password && c.email && validateEmail(c.email)) {
        return true;
      } else { return false; }
    }

    const handleLogin = () => {
      if(!validate()) {
        cValidateMsg.value = 'Please enter valid information.';
      } else {
        cValidateMsg.value = `<img src="/img/loading.svg" class="mx-auto">`;
        store.dispatch('user/attemptLogin', credentials.value);
      }
    }

    onMounted(() => {
      store.dispatch('app/initialize'); // double down on cleanup to circumvent multi-tab/local storage bringing back stale data
    })

    return {
      clearValidate,
      credentials,
      cValidateMsg,
      handleLogin,
      validate
    }
  }
}
</script>

<style lang="postcss" scoped>
  .loading-enter-active,
  .loading-leave-active {
    transition: all 0.25s ease;
  }

  .loading-enter-from,
  .loading-leave-to {
    transform: translateX(-16px);
    opacity: 0;
  }
</style>