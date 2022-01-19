<script setup>
  import GlobalNav from '@/components/GlobalNav.vue'
  import GlobalMenu from '@/components/GlobalMenu.vue'
  import GlobalFooter from '@/components/GlobalFooter.vue'
  import ToastMessage from '@/components/ToastMessage.vue'
  import { computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { objSort } from '@/helpers/shared.js'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const loggedIn = computed(() => store.getters['user/loggedIn'])
  const menuOpen = computed(() => store.getters['app/windowOpen'] === 1)
  const menuItems = computed(() => {
    const routes = router.getRoutes()
    const items = routes.filter((item) => {
      if (item.meta.menu && item.meta.menu.visible) {
        item.menuPosition = item.meta.menu.position // necessary for sorting - objSort does not work for nested keys
        if (item.meta.authRequired) {
          return item.meta.authRequired === Boolean(loggedIn.value) ? true : false
        } else {
          return true
        }
      }
    })
    return items.sort(objSort('menuPosition', false))
  })
  const mode = computed(() => route.meta.mode)
  const routeFull = computed(() => route.fullPath)

  watch(loggedIn, () => {
    if (!loggedIn.value && route.name !== 'home') {
      router.push({ name: 'home' }) // redirect in other tabs in case of logout
    }
  })

  onMounted(() => {
    const app = document.getElementById('app')
    app.style.opacity = '1'
    app.style.transition = 'opacity 1.5s ease'
    setTimeout(updateList, 250) // timeout is required here otherwise 'route.meta.mode' is undefined
  })

  const updateList = () => {
    if (mode.value) { // double check 'mode' here, just in case
      store.dispatch('list/readList', mode.value)
    }
  }
</script>

<template>
  <section id="app-inner" class="flex flex-col min-h-screen">
    <GlobalNav />
    <section class="container flex flex-col flex-grow flex-shrink-0 px-4 mx-auto">
      <router-view :key="routeFull" />
    </section>
    <GlobalFooter :menuItems="menuItems" />
  </section>
  <GlobalMenu :menuItems="menuItems" :show="menuOpen" />
  <ToastMessage />
</template>