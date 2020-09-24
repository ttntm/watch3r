<template>
  <footer class="text-sm p-4 mt-8">
    <div class="footer-nav flex flex-row justify-center items-center">
      <router-link :to="{name: 'about'}">
        About
      </router-link>
      <router-link :to="{name: 'watchlist'}">
        Watchlist
      </router-link>
      <router-link :to="{name: 'tracker'}">
        Tracker
      </router-link>
    </div>
    <p class="text-xs text-center mt-2 mb-0">&copy; 2020</p>
  </footer>
</template>

<script>
export default {
  name: 'GlobalFooter'
}
</script>

<style lang="postcss" scoped>
  .footer-nav a {
    @apply text-yellow-600 font-bold px-2;
  }
  .footer-nav a:hover {
    @apply text-gray-900;
  }
</style>