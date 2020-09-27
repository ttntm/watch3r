<template>
  <div id="tracklist" class="">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <div class="mb-8 sm:mb-0">
        <h2 class="text-yellow-600">Tracklist</h2>
        <p class="mb-0">Track watched titles, rate them and write down some notes.</p>
      </div>
      <div>
        <BtnAddTitle />
        <ListAddModal mode="tracklist" />
      </div>
    </div>
    <div class="text-center mb-8">
      Search | Filters | Sorting
    </div>
    <div class="list tracklist">
      <ListItem mode="track" />
      <ListItem mode="track" />
      <ListItem mode="track" />
    </div>
  </div>
</template>

<script>
import BtnAddTitle from '@/components/buttons/BtnAddTitle.vue';
import ListAddModal from '@/components/list/ListAddModal.vue';
import ListItem from '@/components/list/ListItem.vue';

export default {
  name: 'Tracklist',
  components: {
    BtnAddTitle,
    ListAddModal,
    ListItem
  }
}
</script>

<style lang="postcss" scoped>
  .list .list-item:last-child {
    @apply border-transparent;
  }
</style>