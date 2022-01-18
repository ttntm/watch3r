<script setup>
  import { onMounted, reactive, ref } from 'vue'
  import { useStore } from 'vuex'
  import { validateEmail } from '@/helpers/shared.js'

  const store = useStore()

  const credentials = reactive({ email: '', password: '' })
  const cValidateMsg = ref('')

  onMounted(() => {
    store.dispatch('app/initialize') // double down on cleanup to circumvent multi-tab/local storage bringing back stale data
  })

  const validate = (c) => {
    if (!c.password || !c.email) {
      return false
    } else if (c.password && c.email && validateEmail(c.email)) {
      return true
    } else { return false }
  }

  const events = {
    onInput() {
      cValidateMsg.value = ''
    },

    onSubmit() {
      if (!validate(credentials)) {
        cValidateMsg.value = 'Please enter valid information.'
      } else {
        cValidateMsg.value = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#d69e2e" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round" transform="rotate(123.903 50 50)">
              <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
            </circle>
          </svg>
        `;
        store.dispatch('user/attemptLogin', credentials)
      }
    }
  }
</script>

<template>
  <form
    id="login-form"
    class="text-left bg-gray-400 text-gray-800 rounded-md shadow-lg border border-gray-700 px-12 py-10"
    @submit.prevent="events.onSubmit()"
  >
    <div class="input-group">
      <label for="login-email">Email</label>
      <input id="login-email" v-model="credentials.email" type="email" placeholder="jane@doe.com" @input="events.onInput()">
    </div>
    <div class="input-group">
      <label for="login-pwd">Password</label>
      <input id="login-pwd" v-model="credentials.password" type="password" placeholder="************" @input="events.onInput()">
      <router-link :to="{name: 'recover'}" class="text-xs italic text-gray-600 hover:text-gray-800 mt-2 mb-0">
        Forgot your password?
      </router-link>
    </div>
    <button v-click-blur type="submit" class="btn btn-black" :disabled="!credentials.email || !credentials.password">Login</button>
    <transition name="loading">
      <p v-if="cValidateMsg !== ''" class="text-sm font-bold mt-6 mb-0" :class="{ 'text-red-500' : !validate(credentials) }" v-html="cValidateMsg" />
    </transition>
  </form>
</template>

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