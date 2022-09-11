<script setup>
  const props = defineProps({
    display: {
      type: String,
      default: 'text'
    },
    id: String
  })
</script>

<template>
  <router-link
    :to="{ name: 'explore', query: { title: id, source: 'list' } }"
    :class="{ 'explore-link-text hidden lg:inline-flex' : display === 'text' }"
  >
    <svg v-if="display === 'text'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-right" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="9 6 15 12 9 18" />
    </svg>
    Get Recommendations
  </router-link>
</template>

<style lang="postcss" scoped>
  .explore-link-text {
    @apply flex-row items-center text-gray-600 text-sm leading-none mt-2;
  }

  .explore-link-text:hover {
    @apply text-gray-900;
  }
</style>