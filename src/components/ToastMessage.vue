<template>
  <transition name="toast-fade">
    <section v-if="toastMessage" id="toast-message" class="fixed bottom-0 right-0 max-w-md z-20 m-8">
      <div
        :class="{
          'error': toastMessage.type === 'error',
          'success': toastMessage.type === 'success'
        }"
        class="toast"
        style="min-width: 240px"
      >
        <button
          class="opacity-75 cursor-pointer absolute top-0 right-0 py-2 px-3 hover:opacity-100 focus:outline-none"
          @click.prevent="closeToastMessage()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div class="flex items-center">
          <span class="block font-bold text-sm">
            {{ toastMessage.text }}
          </span>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ToastMessage',
  setup() {
    const store = useStore();

    const closeToastMessage = () => {
      store.dispatch('app/sendToastMessage', null);
    }

    return {
      closeToastMessage,
      toastMessage: computed(() => store.getters['app/toastMessage'])
    }
  }
};
</script>