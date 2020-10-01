<template>
  <div class="shadow-lg sm:mr-8">
    <InputSearch class="text-gray-700" pch="Title or Genre" />
  </div>
</template>

<script>
import InputSearch from '@/components/InputSearch.vue';
import {computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListSearch',
  components: {
    InputSearch
  },
  props: {
    mode: String
  },
  setup() {
    return {}
  }
}
</script>

<style>

</style>