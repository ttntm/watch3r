<template>
  <h2>Log in (Admin)</h2>
  <form
    name="login"
    @submit.prevent="handleAdmin()"
  >
    <div class="message" />
    <p>
      <label>Email<br>
        <input v-model="credentials.email" type="email" name="email">
      </label>
    </p>
    <p>
      <label>Password<br>
        <input v-model="credentials.password" type="password" name="password">
      </label>
    </p>
    <button type="submit">
      Log in
    </button>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Admin',
  setup() {
    const store = useStore();

    const auth = store.getters['user/GoTrueAuth'];
    const credentials = ref({ email: '', password: '' });

    const handleAdmin = () => {
      auth
        .login(credentials.value.email, credentials.value.password, true)
        .then(response => {
          console.log(response);
          const myAuthHeader = "Bearer " + response.token.access_token; //creates the bearer token
          fetch("/.netlify/functions/userlist", { method: 'GET' })
            .then(response => {
              return response.json();
            })
            .then(data => {
              console.log(data);
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });
    }

    return {
      credentials,
      handleAdmin
    }
  }
}
</script>

<style>

</style>