<template>
  <div v-if="modalOpen">Edit</div>
</template>

<script>
import {computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListEditModal',
  props: {},
  setup(props) {
    const store = useStore();

    const modalOpen = computed(() => store.getters['list/addTitleOpen']);

    return {
      modalOpen
    }
  }
}
</script>

<style lang="postcss" scoped>

</style>