<template>
  <section id="user-profile" class="flex flex-grow items-center justify-items-center w-full h-full">
    <section id="user-profile-form" class="user-profile-box flex flex-col md:flex-row self-start py-10 px-12 mx-auto">
      <div class="flex flex-row md:flex-col text-lg font-bold tracking-wide">
        <a class="text-gray-600 hover:text-gray-800 mb-4" href="#account" @click.prevent="setProfileTab(0)">Account</a>
        <a class="text-gray-600 hover:text-gray-800 mb-4" href="#settings" @click.prevent="setProfileTab(1)">Settings</a>
        <a class="text-gray-600 hover:text-gray-800 mb-4" href="#export" @click.prevent="setProfileTab(2)">Export</a>
      </div>
      <div class="user-profile-content">
        <ProfileUserDetails v-if="profileTab === 0" v-model="userOptions.password" :email="user.email" />
        <ProfileUserSettings v-if="profileTab === 1" :options="userOptions.data" @update:settings="updateSettings($event)" />
        <button v-click-blur class="btn btn-black" :disabled="!btnState.enabled" @click="updateUserProfile()">
          {{ btnState.text }}
        </button>
      </div>
    </section>
  </section>
</template>

<script>
import ProfileUserDetails from '@/components/profile/ProfileUserDetails.vue';
import ProfileUserSettings from '@/components/profile/ProfileUserSettings.vue';
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Profile',
  components: {
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
    const showExplore = computed(() => store.getters['user/showExploreLinks'])
    const showIMDb = computed(() => store.getters['user/showIMDbLinks'])
    const sortPreset = computed(() => store.getters['user/sortPreset']);
    const startPreset = computed(() => store.getters['user/startPage']);
    const user = computed(() => store.getters['user/currentUser']);
    const userOptions = reactive({
      email: user.value.email,
      password: '',
      data: {
        user_explore: showExplore.value,
        user_imdb: showIMDb.value,
        user_sort: sortPreset.value,
        user_start: pages[startPreset.value]
      }
    });

    const setProfileTab = (t) => { profileTab.value = t; }

    const updateSettings = (s) => { userOptions.data = s; }

    const updateUserProfile = () => {
      let newData = {
        email: user.value.email,
        data: userOptions.data
      };

      newData.data.user_start = pages.indexOf(userOptions.data.user_start); // convert String back to Number

      if (userOptions.password !== '') {
        newData.password = userOptions.password;
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
      userOptions
    }
  }
}
</script>

<style lang="postcss" scoped>
  .user-profile-box {
    @apply bg-gray-400 text-gray-800 text-left rounded-md shadow-lg border border-gray-700;
  }

  .user-profile-content {
    @apply w-full max-w-sm;
  }

  @media (min-width: 768px) {
    .user-profile-content {
      min-width: 24rem;
      margin-left: 5rem;
    }
  }
</style>