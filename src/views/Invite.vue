<script setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { validateEmail } from '@/helpers/shared.js'

  const router = useRouter()
  const store = useStore()

  const btnRequest = reactive({ active: true, text: 'Request Invite' })
  const cred = reactive({ email: '' })

  const onSubmit = (obj) => {
    const encode = (data) => {
      return Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&')
    }

    if (validateEmail(cred.email)) {
      btnRequest.active = false
      btnRequest.text = 'Requesting...'

      fetch('/', {
        body: encode({
          'form-name': 'RequestInvite',
          ...obj
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
      })
      .then(() => {
        store.dispatch('app/sendToastMessage', { text: `Request received! Keep an eye on your inbox, we'll contact you soon...`, type: 'success' })
        setTimeout(() => {
          router.push({ name: 'home' })
        }, 2000)
      })
      .catch(() => {
        store.dispatch('app/sendToastMessage', { text: `Oops, seems like an error occured. Please try again later.`, type: 'error' })
        btnRequest.active = true
        btnRequest.text = 'Request Invite'
      })
    } else {
      alert('Please enter a valid email address...')
      btnRequest.active = false
      setTimeout(() => {
        btnRequest.active = true
        btnRequest.text = 'Request Invite'
      }, 2000)
    }
  }
</script>

<template>
  <div id="invite" class="flex flex-grow items-center justify-items-center w-full h-full">
    <div class="flex flex-col just-items-center w-full max-w-md self-center mx-auto">
      <img src="/img/icon.svg" class="mx-auto mb-10" alt="WATCH3R" style="width: 125px">
      <form
        id="invite-form"
        name="RequestInvite"
        netlify-honeypot="bot-field"
        class="invite-box px-12 py-10"
        netlify
        @submit.prevent="onSubmit(cred)"
      >
        <h2 class="text-xl text-blue-800">Request an Invite</h2>
        <p class="text-sm">
          You'll understand that as a free service, we have to be careful with our bandwidth and storage consumption. If there are sufficient capacities available, we'll happily send you an invite.
        </p>
        <input name="bot-field" type="hidden">
        <div class="input-group mb-8">
          <label for="email">Email Address</label>
          <input id="email" v-model="cred.email" name="email" type="email" class="text-gray-600" placeholder="hello@watch3r.app">
        </div>
        <button v-click-blur type="submit" class="btn btn-black mr-auto" :disabled="!btnRequest.active || !cred.email">
          {{ btnRequest.text }}
        </button>
      </form>
      <p class="text-xs text-center text-gray-600 mt-8">
        This form will be processed by Netlify. As such, you explicitly agree with Netlify processing your email and IP address according to their <a href="https://www.netlify.com/gdpr-ccpa" target="_blank" class="underline">data processing guidelines</a>.
      </p>
    </div>
  </div>
</template>