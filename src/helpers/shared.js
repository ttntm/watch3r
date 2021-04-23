import store from '../store/index.js';

export function checkDuplicate(mode, input) {
  const current = store.getters[`list/${mode}`];
  if (current.length > 0) {
    return current.filter((item) => item.id === input);
  } else {
    return []
  }
}

export function getAuthHeaders() {
  let headers = {
    'Content-Type': 'application/json'
  };

  store.dispatch('user/refreshUserToken').then((token) => {
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers
  });

  return Promise.resolve(headers)
}

export function objSort (field, reverse, primer) {
  //generic sorting function for object keys
  const key = primer ?
    function(x) {
      return primer(x[field])
    } :
    function(x) {
      return x[field]
    };
  reverse = !reverse ? 1 : -1;

  return function(a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  }
}

export function validateEmail(email) {
  const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
  return rx.test(email);
}

export function validateExtension(filename) {
  const split = filename.split(/\W/g); // returns an Array where the extensions should always be the last item
  const ext = split[split.length - 1].toLowerCase(); // isolate the file's extension
  return ext === 'csv' ? true : false;
}