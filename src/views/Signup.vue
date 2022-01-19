<script setup>
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const msg = reactive({ text: '', type: ''})
  const pwd = ref('')
  const status = ref('')

  const token = computed(() => route.query.t)

  const onSubmit = (p) => {
    msg.text = ''
    msg.type = ''
    status.value = ''

    if (validate()) {
      status.value = `Processing...`
      store.dispatch('user/processInvite', { token: token.value, pwd: p })
        .then(() => {
          store.dispatch('app/sendToastMessage', { text: 'Account created, redirecting to login...', type: 'success' })
          setTimeout(() => {
            router.push({ name: 'home' })
          }, 2000)
        })
        .catch(error => {
          store.dispatch('app/sendToastMessage', { text: 'Error processing the invite, please try again later.', type: 'error' })
          pwd.value = ''
          status.value = ''
        })
    } else {
      store.dispatch('app/sendToastMessage', msg)
    }
  }

  const validate = () => {
    if (!token.value) {
      msg.text = 'Invalid token...'
      msg.type = 'error'
      return false
    } else if (pwd.value.length < 6) {
      msg.text = 'Please choose a more secure password'
      msg.type = 'error'
      return false
    } else {
      return true
    }
  }
</script>

<template>
  <section class="flex flex-grow items-center justify-items-center w-full h-full">
    <div class="text-center self-center max-w-sm mx-auto">
      <img src="/img/icon.svg" class="mx-auto mb-10" alt="WATCH3R" style="width: 125px">
      <form
        id="signup-form"
        class="text-left bg-gray-400 text-gray-800 rounded-md shadow-lg border border-gray-700 px-12 py-10"
        @submit.prevent="onSubmit(pwd)"
      >
        <h2 class="text-xl text-blue-800">
          Confirm Signup
        </h2>
        <p class="text-sm">
          We're almost done processing your invite - please choose a password for your account.
        </p>
        <div class="input-group">
          <label for="signup-pwd">Password</label>
          <input id="signup-pwd" v-model="pwd" type="password" placeholder="************" required>
        </div>
        <button v-click-blur type="submit" class="btn btn-black" :disabled="!pwd">
          Signup
        </button>
        <p v-if="status" class="text-sm font-bold mt-6 mb-0" v-html="status" />
      </form>
      <p class="text-xs text-center text-gray-600 mt-8">
        Signing up for an account means that you explicitly agree with Netlify processing your email and IP address according to their <a href="https://www.netlify.com/gdpr-ccpa" target="_blank" class="underline">data processing guidelines</a>.
        <br><br>
        We don't use analytics, cookies or tracking, so watch3r.app itself does <em>not</em> collect and/or store any personally identifiable information.
      </p>
    </div>
  </section>
</template>