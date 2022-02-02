<script setup>
  const props = defineProps({
    id: String,
    display: {
      type: String,
      default: 'button'
    }
  })
</script>

<template>
  <a 
    :href="`https://www.imdb.com/title/${props.id}`" 
    :class="{ 'hover:shadow-outline focus:shadow-outline' : props.display === 'button' }"
    v-click-blur 
    target="_blank" 
    rel="noopener" 
    title="View on IMDb"
  >
    <img v-if="props.display === 'button'" src="/img/imdb.png" alt="IMDb icon" class="w-4">
    <span v-else class="pointer-events-none">
      <slot>View on IMDb</slot>
    </span>
  </a>
</template>