<template>
  <h1 class="text-2xl text-blue-800 mb-6">
    User Profile
  </h1>
  <div class="input-group mb-8">
    <label for="email">Email Address</label>
    <p class="text-xs text-gray-600 mb-3">
      The email address associated with your account.
    </p>
    <input id="email" :value="email" type="email" class="text-gray-600" disabled>
  </div>
  <div class="input-group mb-8">
    <label for="pwd">New Password</label>
    <p class="text-xs text-gray-600 mb-3">
      Optional; fill to change your current password.
    </p>
    <input id="pwd" :value="modelValue" type="password" placeholder="************" @input="$emit('update:modelValue', $event.target.value)">
  </div>
</template>

<script>
export default {
  name: 'ProfileUserDetails',
  props: {
    email: String,
    modelValue: String,
  },
  emits: ['update:modelValue']
}
</script>

<style lang="postcss" scoped>

</style>