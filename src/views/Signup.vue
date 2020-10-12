<template>
  <div class="flex flex-grow items-center justify-items-center w-full h-full">
    <div class="text-center self-center max-w-sm mx-auto">
      <form
        id="signup-form"
        @submit.prevent="handleSignup(pwd)"
        class="text-left bg-gray-400 text-gray-800 rounded-md shadow-lg border border-gray-700 px-12 py-10"
      >
        <h2 class="text-xl text-blue-800">Confirm Signup</h2>
        <p class="text-sm">
          We're almost done processing your invite - please choose a password for your account.
        </p>
        <div class="input-group">
          <label for="signup-pwd">Password</label>
          <input v-model="pwd" id="signup-pwd" type="password" placeholder="************" required>
        </div>
        <button type="submit" class="btn btn-black" :disabled="!pwd" v-click-blur>Signup</button>
        <p v-if="status" v-html="status" class="text-sm font-bold mt-6 mb-0" />
      </form>
      <p class="text-xs text-center text-gray-600 mt-8">
        Signing up for an account means that you accept Fauna DB and Netlify processing your email and IP address according to their respective data processing guidelines: <a href="https://www2.fauna.com/privacy" target="_blank" class="underline">Fauna DB</a> | <a href="https://www.netlify.com/gdpr-ccpa" target="_blank" class="underline">Netlify</a>.
        <br /><br />
        We don't use analytics, cookies or tracking, so watch3r.app itself does <em>not</em> collect and/or store any personally identifiable information.
      </p>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'Signup',
  setup() {
    const router = useRouter();
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
    }

    const handleSignup = (pwd) => {
      // clear previous msg/status state first
      msg.value = { text: '', type: ''};
      status.value = '';

      if(validate()) {
        status.value = `Processing...`;
        store.dispatch('user/processInvite', { token: token.value, pwd: pwd })
          .then(() => {
            msg.value.text = 'Account created, redirecting to login...';
            msg.value.type =  'success';
            store.dispatch('app/sendToastMessage', msg);
            setTimeout(() => {
              router.push({ name: 'home' });
            }, 2000);
          })
          .catch(error => {
            msg.value.text = 'Error processing the invite, please try again later.';
            msg.value.type =  'error';
            store.dispatch('app/sendToastMessage', msg);
          });
      } else {
        store.dispatch('app/sendToastMessage', msg);
      }
    }

    return {
      handleSignup,
      pwd,
      status
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>