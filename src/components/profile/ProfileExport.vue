<script setup>
  import InputRadio from '@/components/input/InputRadio.vue'
  import FileSaver from 'file-saver'
  import Papa from 'papaparse'
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'

  const store = useStore()

  const exportFormat = ref('CSV')
  const exportMode = ref('watchlist')

  const list = computed(() => store.getters[`list/${exportMode.value}`])
  const listLength = computed(() => list.value.length)

  const events = {
    onBtnExportClick() {
      let data = [...list.value]
      const ext = exportFormat.value.toLowerCase()

      ext === 'csv' ? data = Papa.unparse(data) : data = JSON.stringify(data)

      const blob = new Blob([data], { type: 'text/plaincharset=utf-8' })

      FileSaver.saveAs(blob, `watch3r--${exportMode.value}.${ext}`)
    },

    onReloadList(m) {
      store.dispatch('list/readList', m)
    },

    OnUpdateExportFormat(f) {
      exportFormat.value = f
    },

    onUpdateExportMode(m) {
      exportMode.value = m
    }
  }
</script>

<template>
  <h1 class="text-2xl text-blue-800">List Export</h1>
  <p class="text-sm">Select a list to export and the desired export format. Export files will save to your device based on your browser's settings.</p>
  <div class="h-px bg-gray-500 my-6" />
  <div class="flex flex-row items-center text-sm gap-4 mb-4">
    <span class="font-bold">Mode:</span>
    <InputRadio
      :label="'watchlist'"
      :value="exportMode"
      name="export-mode"
      @update:radio="events.onUpdateExportMode($event)"
    />
    <InputRadio
      :label="'tracklist'"
      :value="exportMode"
      name="export-mode"
      @update:radio="events.onUpdateExportMode($event)"
    />
  </div>
  <p class="text-sm text-gray-600 md:ml-4">
    &#9432; Your {{ exportMode }} contains {{ listLength }} items.
    <span
      v-if="listLength === 0"
      class="text-yellow-600 hover:underline cursor-pointer"
      @click="events.onReloadList(exportMode)"
    >
      Refresh List
    </span>
  </p>
  <div class="flex flex-row items-center text-sm gap-4">
    <span class="font-bold">Format:</span>
    <InputRadio
      :label="'CSV'"
      :value="exportFormat"
      name="export-format"
      @update:radio="events.OnUpdateExportFormat($event)"
    />
    <InputRadio
      :label="'JSON'"
      :value="exportFormat"
      name="export-format"
      @update:radio="events.OnUpdateExportFormat($event)"
    />
  </div>
  <div class="h-px bg-gray-500 mt-6 mb-8" />
  <button
    v-click-blur
    :disabled="listLength === 0"
    class="btn btn-black flex flex-row items-center justify-center"
    @click="events.onBtnExportClick"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-export mr-1" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
    </svg>
    Export List
  </button>
</template>