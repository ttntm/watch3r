<template>
  <div id="user-profile" class="flex flex-grow items-center justify-items-center w-full h-full">
    <form
      v-if="user"
      id="user-profile-form"
      onsubmit="return false"
      class="user-profile-box w-full max-w-full self-center p-8 mx-auto"
    >
      <h1 class="text-2xl text-blue-800 mb-6">User Profile</h1>
      <div class="input-group mb-8">
        <label for="email">Email Address</label>
        <p class="text-xs text-gray-600 mb-3">The email address associated with your account.</p>
        <input :value="user.email" id="email" type="email" class="text-gray-600" disabled>
      </div>
      <div class="input-group mb-8">
        <label for="pwd">New Password</label>
        <p class="text-xs text-gray-600 mb-3">Optional; fill to change your current password.</p>
        <input v-model="pwd" id="pwd" type="password" placeholder="************">
      </div>
      <div class="input-group mb-8">
        <label for="sort-preset">List Sorting</label>
        <p class="text-xs text-gray-600 mb-3">This option controls how lists are sorted after logging in (unless cached otherwise). Does <em>not</em> override later sort mode selection.</p>
        <div class="w-full relative text-gray-700 text-sm bg-gray-300">
          <select name="sorting" id="sort-preset" v-model="sortSelected">
            <option disabled value="">Default Sorting</option>
            <option v-for="(mode, index) in allSortModes" :key="index" :value="index" class="">{{ mode.name }} ({{ mode.order }})</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg class="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="input-group mb-8">
        <label>Start Page</label>
        <p class="text-xs text-gray-600 mb-3">Automatic forwarding after login.</p>
        <div class="flex flex-row">
          <InputRadio class="text-sm mr-4" name="start-page" :label="'watchlist'" :value="startPage" @update:radio="updateStartPage($event)" />
          <InputRadio class="text-sm" name="start-page" :label="'tracklist'" :value="startPage" @update:radio="updateStartPage($event)" />
        </div>
      </div>
      <button @click="updateUserProfile()" class="btn btn-black" :disabled="!btnState.enabled" v-click-blur>{{ btnState.text }}</button>
    </form>
  </div>
</template>

<script>
import InputRadio from '@/components/input/InputRadio.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Profile',
  components: {
    InputRadio
  },
  setup() {
    const store = useStore();

    const btnState = ref({
      enabled: true,
      text: 'Update Profile'
    });
    const pages = ['watchlist', 'tracklist'];
    const pwd = ref('');
    const sortPreset = computed(() => store.getters[`user/sortPreset`]);
    const sortSelected = ref();
    const startPage = ref('');
    const startPreset = computed(() => store.getters[`user/startPage`]);
    const user = computed(() => store.getters['user/currentUser']);

    const updateStartPage = (s) => { startPage.value = s; }

    const updateUserProfile = () => {
      let newData = {
        email: user.value.email,
        data: {
          user_sort: sortSelected.value,
          user_start: pages.indexOf(startPage.value)
        }
      };

      if (pwd.value !== '') {
        newData.password = pwd.value;
      }

      btnState.value.enabled = false;
      btnState.value.text = `Updating...`;

      store.dispatch('user/updateUserAccount', newData);

      setTimeout(() => {
        btnState.value.enabled = true;
        btnState.value.text = `Update Profile`;
      }, 1500)
    }

    sortSelected.value = sortPreset.value;
    startPage.value = pages[startPreset.value]; // the radios need string values to function

    return {
      allSortModes: store.getters['tools/sortMode'],
      btnState,
      pwd,
      sortSelected,
      startPage,
      updateStartPage,
      updateUserProfile,
      user
    }
  }
}
</script>

<style lang="postcss" scoped>
  .user-profile-box {
    @apply flex flex-col max-w-md bg-gray-400 text-gray-800 text-left rounded-md shadow-lg border border-gray-700;
  }

  select, select option {
    @apply capitalize;
  }

  #sort-preset {
    @apply w-full block appearance-none bg-gray-300 border border-transparent px-2 py-1;
  }

  #sort-preset:focus {
    @apply border-yellow-600 shadow-inner;
  }
</style>