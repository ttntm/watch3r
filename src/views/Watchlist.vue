<template>
  <div id="watchlist" class="">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <div class="mb-8 sm:mb-0">
        <h2 class="text-yellow-600">Watchlist</h2>
        <p class="mb-0">Add titles to your watchlist so you don't lose track of things.</p>
      </div>
      <div>
        <BtnAddTitle />
        <ListAddModal mode="watchlist" />
      </div>
    </div>
    <div class="text-center mb-8">
      Search | Filters | Sorting
    </div>
    <div class="list watchlist">
      <ListItem mode="watch" />
      <ListItem mode="watch" />
      <ListItem mode="watch" />
      <ListItem mode="watch" />
      <ListItem mode="watch" />
      <ListItem mode="watch" />
    </div>
  </div>
</template>

<script>
import BtnAddTitle from '@/components/buttons/BtnAddTitle.vue';
import ListAddModal from '@/components/list/ListAddModal.vue';
import ListItem from '@/components/list/ListItem.vue';

export default {
  name: 'Watchlist',
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