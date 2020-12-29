import store from '@/store';

export function checkDuplicate(mode, input) {
  const current = store.getters[`list/${mode}`];
  if (current.length > 0) {
    return current.filter((item) => item.id === input);
  } else {
    return []
  }
}

export function validateEmail(email) {
  const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
  return rx.test(email);
}