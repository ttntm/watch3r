<template>
  <button
    class="text-gray-800 opacity-75 cursor-pointer hover:opacity-100 focus:outline-none"
    :title="btnTitle"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'BtnClose',
  props: {
    btnTitle: String
  }
}
</script>