<script setup>
  import BtnClose from '@/components/buttons/BtnClose.vue'
  import { useStore } from 'vuex'

  const props = defineProps({
    menuItems: Array,
    show: Boolean
  })

  const store = useStore()

  const onClose = () => {
    store.dispatch('app/toggleWindow', 0)
  }
</script>

<template>
  <transition name="fade">
    <!-- menu backdrop -->
    <div v-if="show" class="app-menu-container sm:bg-transparent" />
  </transition>
  <transition name="slide-fade">
    <nav v-if="show" v-click-outside="onClose" v-esc="onClose" v-scroll-lock class="app-menu">
      <div class="flex flex-row justify-between items-center pr-4 py-2">
        <svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" class="px-4" width="60" viewBox="0 0 172.64 172.64" overflow="visible"><circle transform="rotate(-45 86.319301 86.321345)" fill="#D69E2E" cx="86.32" cy="86.32" r="86.32"/><path fill="gray" d="M126.505 48.295h-19.671c-4.485 0-6.76 1.951-6.76 5.8v31.377l-3.936-6.847c-2.258-3.758-5.843-4.24-8.714-4.24h-5.551c-2.875 0-6.462.482-8.723 4.272l-3.927 6.823V54.095c0-2.646-1.173-5.8-6.76-5.8h-20.33c-5.579 0-6.75 3.154-6.75 5.8v40.771c0 4.668 0 8.355 2.549 13.926l6.583 14.51c1.309 3.158 4.172 5.044 7.658 5.044h17.42c3.708 0 6.344-1.587 7.432-4.491l6.198-17.189c.146-.384.262-.483.26-.483.004-.001.065-.025.24-.025h1.189c.17 0 .235.022.238.022.009.007.126.11.255.442l6.072 17.225c1.018 2.86 3.917 4.5 7.955 4.5h17.56c2.247 0 5.308-.868 7.107-4.975l6.602-14.363c2.552-5.576 2.552-9.264 2.552-13.932v-40.98c.002-2.647-1.169-5.802-6.748-5.802z"/><path fill="#1A202C" d="M130.505 44.295h-19.671c-4.485 0-6.76 1.951-6.76 5.8v31.377l-3.936-6.847c-2.258-3.758-5.843-4.24-8.714-4.24h-5.551c-2.875 0-6.462.482-8.723 4.272l-3.927 6.823V50.095c0-2.646-1.173-5.8-6.76-5.8h-20.33c-5.579 0-6.75 3.154-6.75 5.8v40.771c0 4.668 0 8.355 2.549 13.926l6.583 14.51c1.309 3.158 4.172 5.044 7.658 5.044h17.42c3.708 0 6.344-1.587 7.432-4.491l6.198-17.189c.146-.384.262-.483.26-.483.004-.001.065-.025.24-.025h1.189c.17 0 .235.022.238.022.009.007.126.11.255.442l6.072 17.225c1.018 2.86 3.917 4.5 7.955 4.5h17.56c2.247 0 5.308-.868 7.107-4.975l6.602-14.363c2.552-5.576 2.552-9.264 2.552-13.932v-40.98c.002-2.648-1.169-5.802-6.748-5.802z"/><path fill="#D69E2E" d="M107.526 55.184c-1.19 0-2.155.965-2.155 2.155s.965 2.155 2.155 2.155 2.155-.965 2.155-2.155-.965-2.155-2.155-2.155zm6.624 0c-1.19 0-2.155.965-2.155 2.155s.965 2.155 2.155 2.155 2.155-.965 2.155-2.155-.965-2.155-2.155-2.155zm19.873 0c-1.19 0-2.155.965-2.155 2.155s.965 2.155 2.155 2.155 2.155-.965 2.155-2.155-.965-2.155-2.155-2.155zm-6.625 0c-1.19 0-2.155.965-2.155 2.155s.965 2.155 2.155 2.155 2.156-.965 2.156-2.155-.965-2.155-2.156-2.155zm-6.624 0c-1.19 0-2.155.965-2.155 2.155s.965 2.155 2.155 2.155 2.155-.965 2.155-2.155-.964-2.155-2.155-2.155zm-64.544 0c-1.19 0-2.155.965-2.155 2.155s.965 2.155 2.155 2.155 2.155-.965 2.155-2.155-.965-2.155-2.155-2.155zm-13.248 0c-1.19 0-2.155.965-2.155 2.155s.965 2.155 2.155 2.155 2.155-.965 2.155-2.155-.965-2.155-2.155-2.155zm6.624 0c-1.19 0-2.155.965-2.155 2.155s.965 2.155 2.155 2.155 2.155-.965 2.155-2.155-.965-2.155-2.155-2.155zm13.248 0c-1.19 0-2.155.965-2.155 2.155s.965 2.155 2.155 2.155 2.155-.965 2.155-2.155-.965-2.155-2.155-2.155zm6.624 0c-1.19 0-2.155.965-2.155 2.155s.965 2.155 2.155 2.155 2.156-.965 2.156-2.155-.965-2.155-2.156-2.155z"/></svg>
        <BtnClose btn-title="Close Menu" @click="onClose" />
      </div>
      <div class="flex flex-col text-gray-800">
        <router-link v-for="item in menuItems" :key="item.name" v-click-blur :to="{ name: item.name, force: true }" class="menu-item">
          {{ item.name }}
        </router-link>
      </div>
    </nav>
  </transition>
</template>