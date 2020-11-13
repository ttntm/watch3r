<template>
  <div class="inline-flex items-center relative">
    <input type="radio" v-model="radio" :id="label" :name="name" :value="label">
    <label class="capitalize w-full" :for="label">{{ label }}</label>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'InputRadio',
  props: {
    name: String,
    label: String,
    value: String
  },
  setup(props, { emit }) {
    // see: https://stackoverflow.com/questions/40474634/vuejs-radio-button-component
    const radio = computed({
      get: () => {
        return props.value; // the respective current value from the parent component; to determine whether or not the input is checked
      },
      set: () => {
        emit('update:radio', props.label); // emit the desired value back to the parent where an event catches it and updates the state accordingly
      }
    })

    return {
      radio
    }
  }
}
</script>

<style lang="postcss" scoped>
  input[type=radio] {
    @apply absolute top-auto overflow-hidden whitespace-no-wrap;
    clip: rect(1px, 1px, 1px, 1px);
    width: 1px;
    height: 1px;
  }

  input[type=radio]:focus + label {
    @apply text-yellow-600 underline;
  }

  input[type=radio] + label {
    @apply block pl-4 ml-2;
  }

  input[type=radio] + label::before {
    content: '';
    @apply block rounded-full bg-gray-300 border border-solid border-gray-800 text-center cursor-pointer -ml-5 mt-1;
    float: left;
    width: 1em;
    height: 1em;
    vertical-align: top;
  }

  input[type=radio]:checked + label::before {
    @apply bg-blue-800;
    box-shadow: inset 0 0 0 .15em rgba(255, 255, 255, .95);
  }

  label {
    line-height: 22px;
  }
</style>