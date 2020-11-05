<template>
  <button
    class="btn btn-muted flex flex-row items-center justify-center click-outside-ignore"
    @click.prevent="openListItemControls()"
    v-click-blur
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-dots-circle-horizontal mr-1" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <circle cx="12" cy="12" r="9" />
      <line x1="8" y1="12" x2="8" y2="12.01" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
      <line x1="16" y1="12" x2="16" y2="12.01" />
    </svg>
    Actions
  </button>
</template>

<script>
import { useStore } from 'vuex';

export default {
  name: 'BtnListItemControls',
  props: {
    id: String,
    mode: String
  },
  setup(props) {
    const store = useStore();

    const openListItemControls = () => {
      store.dispatch('list/selectEditTitle', [props.id, props.mode]);
      store.dispatch('app/toggleWindow', 6);
    }

    return {
      openListItemControls
    }
  }
}
</script>