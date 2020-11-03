<template>
  <transition name="slide-fade">
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
          @click.prevent="closeToastMessage()"
          class="font-bold text-lg opacity-75 cursor-pointer absolute top-0 right-0 py-2 px-3 hover:opacity-100 focus:outline-none"
        >×</button>
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
      toastMessage: computed(() => store.getters['app/toastMessage']),
      closeToastMessage
    }
  },
};
</script>

<style lang="postcss" scoped>
  .toast {
    @apply bg-gray-400 text-gray-800 border-solid border-transparent rounded-lg shadow-lg p-6 pr-10;
    border-left-width: 5px;
  }

  .error {
    @apply border-red-700;
  }

  .success {
    @apply border-green-700;
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
</style>