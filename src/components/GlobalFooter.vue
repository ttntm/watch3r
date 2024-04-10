<script setup>
  import BtnMenu from '@/components/buttons/BtnMenu.vue'

  const props = defineProps({
    menuItems: Array
  })

  const date = new Date()
  const year = date.getFullYear()
</script>

<template>
  <footer class="text-sm px-4 py-2 sm:py-4 mt-8">
    <nav class="hidden sm:flex footer-nav flex-row flex-wrap justify-center items-center">
      <router-link v-for="item in menuItems" :key="item.name" v-click-blur :to="{name: item.name}">
        {{ item.name }}
      </router-link>
    </nav>
    <BtnMenu :iconSize="24" class="flex sm:hidden flex-row items-center justify-center text-sm font-bold text-yellow-600 hover:text-gray-900 mx-auto">Show Menu</BtnMenu>
    <p class="text-xs text-center mt-2 mb-0">
      Made with ♥ by <a href="https://ttntm.me" target="_blank" class="hover:text-yellow-600 hover:underline">ttntm</a>, <a href="https://codeberg.org/ttntm/watch3r" target="_blank" rel="noreferrer" class="hover:text-yellow-600 hover:underline">Code@Codeberg (GPL-3.0)</a><br>
      &copy; watch3r.app {{year}}, <a href="https://www.buymeacoffee.com/ttntm" class="text-yellow-600 hover:underline" target="_blank" rel="noreferrer">&plus;Donate</a>, <a href="https://github.com/sponsors/ttntm/" class="text-yellow-600 hover:underline" target="_blank" rel="noreferrer">&plus;Sponsor</a>
    </p>
  </footer>
</template>