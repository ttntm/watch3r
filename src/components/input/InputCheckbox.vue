<template>
  <!-- BOOLEAN CHECKBOX, DO NOT USE WITH STRING VALUES -->
  <label class="cb-container" :for="name">
    <slot />
    <input
      :id="name"
      :name="name"
      :checked="modelValue"
      type="checkbox"
      @input="$emit('update:modelValue', $event.target.checked)"
    >
    <span class="checkmark" />
  </label>
</template>

<script>
export default {
  name: 'InputCheckbox',
  props: {
    modelValue: Boolean,
    name: String
  },
  emits: ['update:modelValue']
}
</script>

<style lang="postcss" scoped>
  /* Customize the label (the cb-container) */
  .cb-container {
    @apply flex flex-row relative font-normal text-sm leading-tight cursor-pointer pl-8 m-0;
  }

  .cb-container:focus-within {
    @apply text-yellow-600 underline;
  }

  /* Hide the browser's default checkbox */
  .cb-container input {
    @apply absolute opacity-0 cursor-pointer h-0 w-0;
  }

  /* Create a custom checkbox */
  .checkmark {
    @apply absolute top-0 left-0 bg-gray-300 border border-solid border-gray-800 shadow-inner;
    height: 16px;
    width: 16px;
  }

  /* When the checkbox is checked, add a background */
  .cb-container input:checked~.checkmark {
    @apply bg-blue-800 border-blue-800;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    @apply absolute hidden;
  }

  /* Show the checkmark when checked */
  .cb-container input:checked~.checkmark:after {
    @apply block;
  }

  /* Style the checkmark/indicator */
  .cb-container .checkmark:after {
    left: 4px;
    top: 1px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
</style>