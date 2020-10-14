import { createStore } from 'vuex';
import app from './modules/app';
import list from './modules/list';
import tools from './modules/tools';
import user from './modules/user';

import createPersistedState from 'vuex-persistedstate';
import SecureLS from 'secure-ls'; // https://github.com/softvar/secure-ls

var ls = new SecureLS({ isCompression: false });

export default createStore({
  strict: false, //process.env.NODE_ENV !== "production", -> see: https://github.com/chiubaca/vue-netlify-fauna-starter-kit/issues/12
  modules: {
    app,
    list,
    tools,
    user
  },
  plugins: [
    createPersistedState({
      key: 'w3',
      paths: ['user'],
      reducer (val) {
        if(!val.user.currentUser) { // return empty state when user logged out
          return {}
        }
        return val
      },
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
});