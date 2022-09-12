<script setup>
  import BtnAddTitle from '@/components/buttons/BtnAddTitle.vue'
  import BtnToTop from '@/components/buttons/BtnToTop.vue'
  import ListAddModal from '@/components/list/ListAddModal.vue'
  import ListEditModal from '@/components/list/ListEditModal.vue'
  import ListFilter from '@/components/list/ListFilter.vue'
  import ListItem from '@/components/list/ListItem.vue'
  import ListItemControls from '@/components/list/ListItemControls.vue'
  import ListLoading from '@/components/list/ListLoading.vue'
  import ListPosterModal from '@/components/list/ListPosterModal.vue'
  import ListSearch from '@/components/list/ListSearch.vue'
  import ListSearchStatus from '@/components/list/ListSearchStatus.vue'
  import ListSort from '@/components/list/ListSort.vue'
  import ModalBackdrop from '@/components/ModalBackdrop.vue'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'

  const route = useRoute()
  const store = useStore()

  const posterSrc = ref('')
  const posterTitle = ref('')
  
  const listData = computed(() => store.getters[`list/${mode.value}`])
  const listLength = computed(() => listData.value.length)
  const mode = computed(() => route.meta.mode)
  const modalOpen = computed(() => store.getters['app/windowOpen'])
  const subtitle = computed(() => route.meta.subtitle)
  const searchActive = computed(() => store.getters['tools/searchActive'])

  const getListData = () => {
    if (listLength.value === 0 && !searchActive.value) {
      store.dispatch('list/readList', mode.value)
    }
  }

  const onShowPoster = (args) => {
    const [src, title] = args
    posterSrc.value = src
    posterTitle.value = title
    store.dispatch('app/toggleWindow', 4)
  }

  getListData()
</script>

<template>
  <section id="list" class="">
    <section class="flex flex-col sm:flex-row sm:items-center justify-between">
      <div class="mb-8 sm:mb-0 sm:mr-8 lg:mr-0">
        <h2 class="text-yellow-600 capitalize">{{ mode }}</h2>
        <p class="mb-0">
          {{ subtitle }}
          <span v-if="listLength !== 0 && !searchActive" class="font-bold">Your {{ mode }} contains {{ listLength }} items.</span>
        </p>
      </div>
      <div class="flex-shrink-0">
        <BtnAddTitle />
      </div>
    </section>
    <ListLoading v-if="listLength === 0 && !searchActive" />
    <section v-else class="md:px-2 lg:px-8 xl:px-12 my-8">
      <div class="flex flex-col md:flex-row items-center">
        <ListSearch :mode="mode" class="flex-1" />
        <ListFilter :mode="mode" class="flex-1" />
        <ListSort :mode="mode" class="flex-1" />
      </div>
      <ListSearchStatus v-if="searchActive" :mode="mode" class="mt-8" />
    </section>
    <section v-if="listLength > 0" class="list">
      <ListItem v-for="title in listData" :key="title.id" :item="title" :mode="mode" @open-poster="onShowPoster($event)" />
    </section>
  </section>
  <ListAddModal v-if="modalOpen === 2" :mode="mode" />
  <ListEditModal v-if="modalOpen === 3" :mode="mode" />
  <ListPosterModal v-if="modalOpen === 4" :poster="posterSrc" :title="posterTitle" />
  <ListItemControls v-if="modalOpen === 6" :mode="mode" />
  <ModalBackdrop />
  <BtnToTop v-if="!modalOpen" />
</template>