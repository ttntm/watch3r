<template>
  <div class="flex flex-grow items-center justify-items-center w-full h-full">
    <div class="text-center self-center max-w-full md:max-w-sm mx-auto">
      <div class="mb-16">
        <h1 class="text-3xl text-yellow-600">watch3r</h1>
        <h2 class="text-xl">A watchlist and tracking app for your movies and series</h2>
      </div>
      <div v-if="loggedIn" class="flex flex-col items-center">
        <router-link :to="{name: 'watchlist'}" class="btn btn-black mb-4">
          Watchlist
        </router-link>
        <router-link :to="{name: 'tracker'}" class="btn btn-black mb-4">
          Tracker
        </router-link>
        <router-link :to="{name: 'about'}" class="btn btn-black mb-4">
          About
        </router-link>
      </div>
      <div v-else class="text-left bg-gray-400 text-gray-800 rounded-md shadow-lg border border-gray-700 px-12 py-10">
        <div class="login-input-group">
          <label for="login-email">Email Address</label>
          <input v-model="crendentials.email" id="login-email" type="email" placeholder="jane@doe.com" required>
        </div>
        <div class="login-input-group">
          <label for="login-pwd">Password</label>
          <input v-model="crendentials.password" @keyup.enter="login()" id="login-pwd" type="password" placeholder="************" required>
        </div>
        <button @click="login()" class="btn btn-black">Login</button>
        <p v-if="cValidateMsg !== ''" v-html="cValidateMsg" class="text-sm font-bold mt-6 mb-0" :class="{ 'text-red-500' : !cValidate }" />
      </div>
      <p v-if="!loggedIn" class="text-sm mt-8">No account? <a href="mailto:x@z.y" class="text-yellow-600 hover:text-gray-900">Contact us</a> and ask for an invite (no guarantees or promises).</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Home',
  setup() {
    const store = useStore();

    return {
      loggedIn: computed(() => store.getters['user/loggedIn']),
    }
  },
  data() {
    return {
      crendentials: {
        name: "",
        password: "",
        email: ""
      },
      cValidateMsg: '',
      mode: 'login',
    }
  },
  computed: {
    cValidate() {
      let c = this.crendentials;
      let rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
      let valid = rx.test(c.email);
      if(!c.password || !c.email) {
        return false;
      } else if(c.password && c.email && valid) {
        return true;
      } else { return false; }
    }
  },
  methods: {
    login() {
      if(!this.cValidate) {
        this.cValidateMsg = "Please enter valid information.";
      } else {
        let msg = { text: '', type: ''};
        let spinner = require('@/assets/loading.svg');
        this.cValidateMsg = `<img src="${spinner}" class="mx-auto">`;
        this.$store.dispatch('user/attemptLogin', this.crendentials)
          .then(() => {
            msg.text = "You're logged in now";
            msg.type =  'success';
            this.$store.dispatch('app/sendToastMessage', msg); //vuex action sendToastMessage(message)
          })
          .catch(error => {
            this.cValidateMsg = null;
            console.error(error, "Something's gone wrong logging in");
            msg.text = "Something's gone wrong logging in, please try again later.";
            msg.type =  'error';
            this.$store.dispatch('app/sendToastMessage', msg); //vuex action sendToastMessage(message)
          });
      }
    },
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
    @apply bg-gray-300 border-yellow-600 rounded-sm shadow-inner;
  }
</style>