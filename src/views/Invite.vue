<template>
  <div id="invite" class="flex flex-grow items-center justify-items-center w-full h-full">
    <div class="flex flex-col just-items-center w-full max-w-md self-center mx-auto">
      <form
        id="invite-form"
        name="RequestInvite"
        @submit.prevent="handleInvite(cred.email)"
        netlify-honeypot="bot-field"
        class="invite-box px-12 py-10"
        netlify
      >
        <h2 class="text-xl text-blue-800">Request an Invite</h2>
        <p class="text-sm">
          You'll understand that as a free service, we have to be careful with our bandwidth and storage consumption. If there are sufficient capacities available, we'll happily send you an invite.
        </p>
        <input name="bot-field" type="hidden">
        <div class="input-group mb-8">
          <label for="email">Email Address</label>
          <input v-model="cred.email" id="email" name="email" type="email" class="text-gray-600" placeholder="hello@watch3r.app">
        </div>
        <button type="submit" class="btn btn-black mr-auto" :disabled="!btnActive" v-click-blur>Request Invite</button>
      </form>
      <p class="text-xs text-center text-gray-600 mt-8">
        This form will be processed by Netlify. As such, you'll agree with Netlify processing your email and IP address according to their <a href="https://www.netlify.com/gdpr-ccpa" target="_blank" class="underline">data processing guidelines</a>.
      </p>
    </div>
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

    const btnActive = ref(true);
    const cred = ref({ email: '' });
    const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
    const valid = computed(() => rx.test(cred.value.email));

    const encode = (data) => {
      return Object.keys(data)
        .map(
          key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join("&");
    }

    const handleInvite = (o) => {
      let msg = { text: '', type: ''};

      btnActive.value = false;

      if (valid.value) {
        fetch('/', {
          body: encode({
            'form-name': 'RequestInvite',
            ...cred.value
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
        })
        .then(() => {
          msg.value.text = `Request received! Keep an eye on your inbox, we'll contact you soon...`;
          msg.value.type =  'success';
          store.dispatch('app/sendToastMessage', msg);
          setTimeout(() => {
            router.push({ name: 'home' });
          }, 2000);
        })
        .catch(() => {
          msg.value.text = `Oops, seems like an error occured. Please try again later.`;
          msg.value.type =  'error';
          store.dispatch('app/sendToastMessage', msg);
          btnActive.value = true;
        })
      } else {
        alert('Please enter a valid email address...');
        setTimeout(() => {
          btnActive.value = true;
        }, 1000);
      }
    }

    return {
      btnActive,
      cred,
      handleInvite
    }
  }
}
</script>

<style lang="postcss" scoped>
  .invite-box {
    @apply flex flex-col bg-gray-400 text-gray-800 text-left rounded-md shadow-lg border border-gray-700;
  }
</style>