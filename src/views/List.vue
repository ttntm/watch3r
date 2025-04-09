<script setup>
  import BtnAddTitle from '@/components/buttons/BtnAddTitle.vue'
  import BtnToTop from '@/components/buttons/BtnToTop.vue'
  import ListAddModal from '@/components/list/ListAddModal.vue'
  import ListEditModal from '@/components/list/ListEditModal.vue'
  import ListFilter from '@/components/list/ListFilter.vue'
  import ListFilterStatus from '@/components/list/ListFilterStatus.vue'
  import ListItem from '@/components/list/ListItem.vue'
  import ListItemControls from '@/components/list/ListItemControls.vue'
  import ListItemWrapper from '@/components/list/ListItemWrapper.vue'
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

  const filterActive = computed(() => store.getters[`tools/${mode.value}Filtered`] > 0)
  const listData = computed(() => store.getters[`list/${mode.value}`])
  const listLength = computed(() => listData.value.length)
  const listInfo = computed(() => {
    return filterActive.value
      ? `Your <u class="inline-block no-underline border-b border-yellow-600">filtered</u> ${mode.value} contains ${listLength.value} items.`
      : `Your ${mode.value} contains ${listLength.value} items.`
  })
  const mode = computed(() => route.meta.mode)
  const modalOpen = computed(() => store.getters['app/windowOpen'])
  const showExplore = computed(() => store.getters['user/showExploreLinks'])
  const showIMDb = computed(() => store.getters['user/showIMDbLinks'])
  const showWatching = computed(() => store.getters['user/showWatching'])
  const subtitle = computed(() => route.meta.subtitle)
  const searchActive = computed(() => store.getters['tools/searchActive'])

  const getListData = () => {
    if (listLength.value === 0 && !filterActive.value && !searchActive.value) {
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
  <div id="list" class="">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between">
      <div class="mb-8 sm:mb-0 sm:mr-8 lg:mr-0">
        <h2 class="text-yellow-600 capitalize">{{ mode }}</h2>
        <p class="mb-0">
          {{ subtitle }}
          <span v-if="listLength !== 0 && !searchActive" v-html="listInfo" class="font-bold" />
        </p>
      </div>
      <div class="flex-shrink-0">
        <BtnAddTitle />
      </div>
    </div>
    <ListLoading v-if="listLength === 0 && !filterActive && !searchActive" />
    <div v-else class="md:px-2 lg:px-8 xl:px-12 my-8">
      <div class="flex flex-col md:flex-row items-center">
        <ListSearch :list-length="listLength" :mode="mode" class="flex-1" />
        <ListFilter :list-length="listLength" :mode="mode" class="flex-1" />
        <ListSort :list-length="listLength" :mode="mode" class="flex-1" />
      </div>
      <ListFilterStatus v-if="filterActive && listLength === 0" :mode="mode" class="mt-8" />
      <ListSearchStatus v-if="searchActive && (!filterActive || listLength >= 1)" :mode="mode" class="mt-8" />
    </div>
    <div v-if="listLength > 0" class="list">
      <ListItemWrapper v-for="title in listData" style="min-height: 250px;">
        <ListItem
          :key="title.id"
          :item="title"
          :mode="mode"
          :showExplore="showExplore"
          :showIMDb="showIMDb"
          :showWatching="showWatching"
          @open-poster="onShowPoster($event)"
        />
      </ListItemWrapper>
    </div>
  </div>
  <ListAddModal v-if="modalOpen === 2" :mode="mode" />
  <ListEditModal v-if="modalOpen === 3" :mode="mode" />
  <ListPosterModal v-if="modalOpen === 4" :poster="posterSrc" :title="posterTitle" />
  <ListItemControls v-if="modalOpen === 6" :mode="mode" />
  <ModalBackdrop />
  <BtnToTop v-if="!modalOpen" />
</template>