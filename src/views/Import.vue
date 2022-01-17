<template>
  <section id="import">
    <section class="w-full sm:w-2/3 lg:w-1/2 sm:text-center mx-auto">
      <h1 class="h2 text-yellow-600">
        List Import
      </h1>
      <h2 class="text-base font-normal">
        Select an IMDb export CSV file and import your listed titles.
      </h2>
      <p class="text-sm mb-0">
        To export a list from IMDb (i.e. the default watchlist), simply scroll down to the end of the list and click "Export this list".
      </p>
      <div class="h-px bg-gray-600 my-8" />
      <InputFile @update:file="processCSV($event)" />
      <div v-if="importList.length > 0" class="flex flex-row items-center justify-center text-sm my-8">
        <span class="font-bold mr-2">Import Mode:</span>
        <InputRadio class="mr-4" name="import-mode" :label="'watchlist'" :value="importMode" @update:radio="updateImportMode($event)" />
        <InputRadio class="" name="import-mode" :label="'tracklist'" :value="importMode" @update:radio="updateImportMode($event)" />
      </div>
    </section>
    <section v-if="importList.length > 0" class="list w-full xl:w-2/3 mx-auto">
      <ListItemImport v-for="item in importList" :key="item.Const" :item="item" :mode="importMode" @import-title="importTitle($event)" />
    </section>
  </section>
  <!-- MODALS -->
  <ListAddModal v-if="modalOpen === 7" :content-import="importContent" :mode="importMode" />
  <!-- OVERLAY -->
  <ModalBackdrop />
  <!-- BTT Button -->
  <BtnToTop v-if="!modalOpen" />
</template>

<script>
import BtnToTop from '../components/buttons/BtnToTop.vue';
import InputFile from '../components/input/InputFile.vue';
import InputRadio from '../components/input/InputRadio.vue';
import ListItemImport from '../components/list/ListItemImport.vue';
import Papa from 'papaparse';
import { computed, defineAsyncComponent, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex';


export default {
  name: 'Import',
  components: {
    BtnToTop,
    InputFile,
    InputRadio,
    ListAddModal: defineAsyncComponent(() => import('../components/list/ListAddModal.vue')),
    ListItemImport,
    ModalBackdrop: defineAsyncComponent(() => import('../components/ModalBackdrop.vue'))
  },
  setup() {
    const store = useStore();

    const importContent = ref({});
    const importList = ref([]);
    const importMode = ref('watchlist');

    const importTitle = (data) => {
      importContent.value = Object.assign({}, data);
      store.dispatch('app/toggleWindow', 7);
    }

    const processCSV = (input) => {
      Papa.parse(input, {
        delimiter: ",",
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const parsed = results.data;
          if (parsed.length > 0 && parsed[0].Const) {
            // parsed[0].Const => means checking the first Object in the parsed Array for an IMDb ID - if that's not there, we consider the CSV invalid
            importList.value = parsed;
          } else {
            store.dispatch('app/sendToastMessage', { text: `Invalid data in the selected CSV. Please try exporting from IMDb again.`, type:  'error' });
          }
        },
        error: function(error) {
          console.error(error);
        }
      });
    }

    const updateImportMode = (m) => { importMode.value = m; };

    onBeforeRouteLeave((to, from) => {
      if (importList.value.length > 0) {
        const answer = window.confirm('Do you really want to leave? The open CSV file will be closed.');
        if (!answer) return false;
      }
    })

    return {
      importContent,
      importList,
      importMode,
      importTitle,
      modalOpen: computed(() => store.getters['app/windowOpen']),
      processCSV,
      updateImportMode
    }
  }
}
</script>

<style lang="postcss" scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.75s;
  }

  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(-100px);
    opacity: 0;
  }
</style>