<template>
  <nav class="w-full flex flex-row justify-items-start items-center px-4 py-2 mb-8">
    <BtnMenu class="block" />
    <div class="flex-grow text-center">
      <!-- <h1 class="text-xl capitalize m-0">
        {{ currentView }}
      </h1> -->
    </div>
    <BtnLogout class="block" />
  </nav>
</template>

<script>
import BtnLogout from '@/components/buttons/BtnLogout.vue';
import BtnMenu from '@/components/buttons/BtnMenu.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'GlobalNav',
  components: {
    BtnLogout,
    BtnMenu
  },
  setup() {
    const route = useRoute();

    return {
      currentView: computed(() => route.name)
    }
  }
}
</script>

<style>

</style>