<template>
  <h1 class="text-2xl text-blue-800">
    List Export
  </h1>
  <p class="text-sm">Select a list to export and the desired export format. Export files will save to your device based on your browser's settings.</p>
  <div class="h-px bg-gray-500 my-6" />
  <div class="flex flex-row items-center text-sm mb-4">
    <span class="font-bold mr-2">Mode:</span>
    <InputRadio class="mr-4" name="export-mode" :label="'watchlist'" :value="exportMode" @update:radio="updateExportMode($event)" />
    <InputRadio class="" name="export-mode" :label="'tracklist'" :value="exportMode" @update:radio="updateExportMode($event)" />
  </div>
  <p class="text-sm text-gray-600 md:ml-4">
    &#9432; Your {{ exportMode }} contains {{ listLength }} items.
    <span v-if="listLength === 0" class="text-yellow-600 hover:underline cursor-pointer" @click="reloadList(exportMode)">
      Refresh List
    </span>
  </p>
  <div class="flex flex-row items-center text-sm">
    <span class="font-bold mr-2">Format:</span>
    <InputRadio class="mr-4" name="export-format" :label="'CSV'" :value="exportFormat" @update:radio="updateExportFormat($event)" />
    <InputRadio class="" name="export-format" :label="'JSON'" :value="exportFormat" @update:radio="updateExportFormat($event)" />
  </div>
  <div class="h-px bg-gray-500 my-6" />
  <button v-click-blur class="btn btn-black flex flex-row items-center justify-center" :disabled="listLength === 0" @click="exportList()">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-export mr-1" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
    </svg>
    Export List
  </button>
</template>

<script>
import InputRadio from '@/components/input/InputRadio.vue';
import FileSaver from 'file-saver';
import Papa from 'papaparse';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ProfileExport',
  components: {
    InputRadio
  },
  setup() {
    const store = useStore();

    const exportFormat = ref('CSV');
    const exportMode = ref('watchlist');
    const list = computed(() => store.getters[`list/${exportMode.value}`]);
    const listLength = computed(() => list.value.length);

    const exportList = () => {
      let data = [...list.value];
      const ext = exportFormat.value.toLowerCase();

      ext === 'csv' ? data = Papa.unparse(data) : data = JSON.stringify(data);

      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });

      FileSaver.saveAs(blob, `watch3r--${exportMode.value}.${ext}`);
    }

    const reloadList = (m) => { store.dispatch('list/readList', m); }

    const updateExportFormat = (f) => { exportFormat.value = f; };

    const updateExportMode = (m) => { exportMode.value = m; };

    return {
      exportFormat,
      exportList,
      exportMode,
      listLength,
      reloadList,
      updateExportFormat,
      updateExportMode
    }
  }
}
</script>