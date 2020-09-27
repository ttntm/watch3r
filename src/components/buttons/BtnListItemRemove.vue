<template>
  <button class="btn btn-muted flex flex-row items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-minus mr-1" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
    Remove
  </button>
</template>

<script>
export default {
  name: 'BtnListItemRemove',
  props: {
    mode: String
  }
}
</script>

<style lang="postcss" scoped>
  .btn-muted {
    @apply text-sm bg-transparent text-gray-600 border border-gray-600 shadow-none;
  }

  .btn-muted:hover,
  .btn-muted:focus {
    @apply bg-gray-600 text-gray-800 border-transparent;
  }
</style>