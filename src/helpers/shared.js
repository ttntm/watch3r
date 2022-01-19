import { ref } from 'vue'
import store from '@/store/index.js'

export function checkDuplicate(mode, input) {
  const current = store.getters[`list/${mode}`]
  return current.length > 0
    ? current.findIndex(item => item.id === input)
    : -1
}

export async function getAuthHeaders() {
  const now = Date.now()
  const user = store.getters['user/currentUser']

  let headers = {
    'Content-Type': 'application/json'
  }

  // only get a new token if the old one has expired
  const token = user.token && user.token.expires_at < now
    ? await store.dispatch('user/refreshUserToken')
    : user.token.access_token

  if (token) headers['Authorization'] = `Bearer ${token}`

  return headers
}

export function objSort(field, reverse, primer) {
  //generic sorting function for object keys
  const key = primer ?
    function(x) {
      return primer(x[field])
    } :
    function(x) {
      return x[field]
    }
  reverse = !reverse ? 1 : -1

  return function(a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a))
  }
}

export function useDelay() {
  const isVisible = ref(false)
  
  const toggleDelay = () => setTimeout(() => isVisible.value = !isVisible.value, 100)

  toggleDelay()

  return { isVisible, toggleDelay }
}

export function validateEmail(email) {
  const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
  return rx.test(email)
}

export function validateExtension(filename) {
  const split = filename.split(/\W/g) // returns an Array where the extensions should always be the last item
  const ext = split[split.length - 1].toLowerCase() // isolate the file's extension
  return ext === 'csv' ? true : false
}