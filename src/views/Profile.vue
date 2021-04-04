<template>
  <section id="user-profile" class="flex flex-grow items-center justify-items-center w-full h-full">
    <section id="user-profile-form" class="user-profile-box flex flex-col md:flex-row self-start py-10 px-12 md:p-0 mx-auto">
      <div class="user-profile-sidebar flex flex-row md:flex-col justify-center md:justify-start flex-wrap md:py-10 md:px-12">
        <a class="mb-4" :class="{ 'current' : profileTab === 0 }" href="#account" @click.prevent="setProfileTab(0)">Account</a>
        <a class="px-4 md:px-0 mb-4" :class="{ 'current' : profileTab === 1 }" href="#settings" @click.prevent="setProfileTab(1)">Settings</a>
        <a class="mb-4" :class="{ 'current' : profileTab === 2 }" href="#export" @click.prevent="setProfileTab(2)">Export</a>
      </div>
      <div class="h-px bg-gray-500 mb-6 md:hidden" />
      <div class="user-profile-content self-stretch md:py-10 md:px-12">
        <ProfileUserDetails v-if="profileTab === 0" v-model="userSettings.password" :email="user.email" />
        <ProfileUserSettings v-if="profileTab === 1" @update:settings="updateSettings($event)" />
        <ProfileExport v-if="profileTab === 2" />
        <button v-if="profileTab !== 2" v-click-blur class="btn btn-black" :disabled="!btnState.enabled" @click="updateUserProfile()">
          {{ btnState.text }}
        </button>
      </div>
    </section>
  </section>
</template>

<script>
import ProfileExport from '../components/profile/ProfileExport.vue';
import ProfileUserDetails from '../components/profile/ProfileUserDetails.vue';
import ProfileUserSettings from '../components/profile/ProfileUserSettings.vue';
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Profile',
  components: {
    ProfileExport,
    ProfileUserDetails,
    ProfileUserSettings
  },
  setup() {
    const store = useStore();

    const btnState = ref({
      enabled: true,
      text: 'Update Profile'
    });
    const pages = ['watchlist', 'tracklist'];
    const profileTab = ref(0);
    const user = computed(() => store.getters['user/currentUser']);
    const userOptions = computed(() => store.getters['user/userOptions']);
    const userSettings = reactive({
      email: user.value.email,
      password: '',
      data: {
        // initial data in case user never goes to the 'settings' tab
        user_explore: userOptions.value.showExploreLinks,
        user_imdb: userOptions.value.showIMDbLinks,
        user_sort: userOptions.value.sortPreset,
        user_start: userOptions.value.startPage
      }
    });

    const setProfileTab = (t) => { profileTab.value = t; }

    const updateSettings = (s) => {
      userSettings.data = s;
      userSettings.data.user_start = pages.indexOf(s.user_start); // convert String (required for radio inputs) back to Number
    }

    const updateUserProfile = () => {
      let newData = {
        email: user.value.email,
        data: { ...userSettings.data }
      };

      if (userSettings.password !== '') {
        newData.password = userSettings.password;
      }

      btnState.value.enabled = false;
      btnState.value.text = `Updating...`;

      store.dispatch('user/updateUserAccount', newData);

      setTimeout(() => {
        btnState.value.enabled = true;
        btnState.value.text = `Update Profile`;
      }, 1500)
    }

    return {
      btnState,
      profileTab,
      setProfileTab,
      updateSettings,
      updateUserProfile,
      user,
      userSettings
    }
  }
}
</script>

<style lang="postcss" scoped>
  .user-profile-box {
    @apply w-full bg-gray-400 text-gray-800 text-left rounded-md shadow-lg border border-gray-700 max-w-screen-sm;
  }

  .user-profile-sidebar {
    @apply font-bold tracking-wide;
  }

  .user-profile-sidebar a {
    @apply text-gray-600;
  }

  .user-profile-sidebar a:hover {
    @apply text-blue-800;
  }

  .user-profile-sidebar a.current {
    @apply text-gray-800;
  }

  .user-profile-content {
    @apply w-full;
  }

  @media (min-width: 768px) {
    .user-profile-sidebar {
      @apply text-lg shadow;
    }

    .user-profile-content {
      min-width: 24rem;
    }
  }
</style>