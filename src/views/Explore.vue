<script setup>
  import BtnAddTitle from '@/components/buttons/BtnAddTitle.vue'
  import BtnExploreClear from '@/components/buttons/BtnExploreClear.vue'
  import BtnIMDb from '@/components/buttons/BtnIMDb.vue'
  import BtnToTop from '@/components/buttons/BtnToTop.vue'
  import ExploreSelectTitle from '@/components/explore/ExploreSelectTitle.vue'
  import ExploreTitleCard from '@/components/explore/ExploreTitleCard.vue'
  import ListAddModal from '@/components/list/ListAddModal.vue'
  import ModalBackdrop from '@/components/ModalBackdrop.vue'
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'

  const store = useStore()

  const exploreContent = ref({})

  const modalOpen = computed(() => store.getters['app/windowOpen'])
  const recMode = computed(() => store.getters['explore/recMode'])
  const recommendations = computed(() => store.getters['explore/recList'])
  const recSource = computed(() => store.getters['explore/recSource'])
  const rsEmpty = computed(() => Object.keys(recSource.value).length <= 0)
  const showIMDb = computed(() => store.getters['user/showIMDbLinks'])

  const events = {
    onCardClick(data) {
      exploreContent.value = Object.assign({}, data)
      store.dispatch('app/toggleWindow', 5)
    },

    switchMode(newMode) {
      if (newMode !== recMode.value) {
        store.dispatch('explore/updateRecMode', newMode)
      }
    }
  }
  
  if (!recMode.value) {
    events.switchMode('manual')
  }
</script>

<template>
  <section id="explore">
    <div class="sm:text-center">
      <h1 class="h2 text-yellow-600">Recommendations</h1>
      <h2 class="text-base font-normal mb-0">Select a title from your Tracklist to get some recommendations.</h2>
    </div>
    <nav class="flex flex-row items-center justify-center flex-grow mt-6">
      <span class="block font-bold mx-4">Source Data:</span>
      <a v-click-blur href="#manual" class="hover:text-yellow-500 mx-4" :class="{ 'text-yellow-500 underline' : recMode === 'manual' }" @click.prevent="events.switchMode('manual')">Manual</a>
      <a v-click-blur href="#list" class="hover:text-yellow-500 mx-4" :class="{ 'text-yellow-500 underline' : recMode === 'list' }" @click.prevent="events.switchMode('list')">Tracklist</a>
    </nav>
    <section class="w-full sm:w-2/3 lg:w-1/2 mx-auto mt-8 mb-12">
      <div class="flex flex-row justify-center" style="height: 42px;">
        <ExploreSelectTitle v-if="recMode === 'list'" />
        <BtnAddTitle v-else btnText="Select Title" />
        <BtnExploreClear v-if="!rsEmpty" class="hidden sm:flex py-2 ml-4 sm:ml-8" />
      </div>
      <transition name="info">
        <p v-if="!rsEmpty && recommendations.length > 0" class="w-full text-center text-sm mt-8 mb-0">
          &#9432; Currently showing recommendations based on <BtnIMDb v-if="showIMDb" :id="recSource.id" display="text" class="inline-block text-yellow-500 hover:underline">{{ recSource.title }}</BtnIMDb><span v-else class="font-bold">{{ recSource.title }}</span> ({{ recSource.year }}).
        </p>
      </transition>
    </section>
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 xl:gap-10 sm:px-4 xl:px-0">
      <ExploreTitleCard v-for="(item, index) in recommendations.slice(0, 20)" :key="index" :item="item" :src="item.poster_path" @add-title="events.onCardClick($event)" />
    </section>
    <div v-if="!recommendations.length && !rsEmpty">
      <img src="/img/loading.svg" class="my-16 mx-auto">
    </div>
    <div v-if="recommendations.length > 0" class="text-center text-sm mt-12">
      <p>Recommendations by:</p>
      <a href="https://www.themoviedb.org" class="inline-block hover:opacity-50" target="_blank" rel="noopener">
        <img src="/img/tmdb.svg" class="block h-4 mx-auto" alt="TMDB logo">
      </a>
    </div>
  </section>
  <ListAddModal v-if="modalOpen === 2" mode="explore" />
  <ListAddModal v-if="modalOpen === 5" :content-explore="exploreContent" mode="watchlist" />
  <ModalBackdrop />
  <BtnToTop v-if="!modalOpen" />
</template>

<style lang="postcss" scoped>
  .info-enter-active,
  .info-leave-active {
    transition: all 0.75s;
  }

  .info-enter-from,
  .info-leave-to {
    transform: translateY(-50px);
    opacity: 0;
  }
</style>