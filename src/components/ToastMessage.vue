<template>
  <div id="toast-message" class="fixed bottom-0 right-0 max-w-md z-20 m-8">
    <transition name="slide-fade">
      <div
        v-if="toastMessage"
        :class="{
          'error': toastMessage.type === 'error',
          'success': toastMessage.type === 'success',
          'bg-gray-400 text-gray-800': toastMessage.type === 'info',
        }"
        class="rounded-lg shadow-md p-6 pr-10"
        style="min-width: 240px"
      >
        <button
          @click.prevent="sendToastMessage(null)"
          class="font-bold text-lg opacity-75 cursor-pointer absolute top-0 right-0 py-2 px-3 hover:opacity-100 focus:outline-none"
        >×</button>
        <div class="flex items-center">
          <span class="block font-bold text-sm">
            {{ toastMessage.text }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ToastMessage',
  setup() {
    const store = useStore();

    const sendToastMessage = (msg) => {
      store.dispatch('app/sendToastMessage', msg);
    }

    return {
      toastMessage: computed(() => store.getters['app/toastMessage']),
      sendToastMessage
    }
  },
};
</script>

<style lang="postcss" scoped>
  .error {
    @apply bg-red-200 text-red-600;
  }
  .success {
    @apply bg-green-200 text-green-600;
  }
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.75s;
  }
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(400px);
    opacity: 0;
  }
  .smiley {
    animation: roll 1.25s linear infinite;
  }
  @keyframes roll {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-20deg);
    }
    50% {
      transform: rotate(10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>