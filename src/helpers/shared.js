import store from '@/store';

export function checkDuplicate(mode, input) {
  const current = store.getters[`list/${mode}`];
  return current.filter((item) => item.id === input);
}