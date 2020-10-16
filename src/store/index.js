import { createStore } from 'vuex';
import app from './modules/app';
import list from './modules/list';
import tools from './modules/tools';
import user from './modules/user';
import createMultiTabState from 'vuex-multi-tab-state';
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
    createMultiTabState({
      key: 'w3-tabs',
      statesPaths: ['list', 'tools', 'user.userOptions', 'user.currentUser'], // name/s of the states to be synchronized with dot notation. If the param is not provided, the whole state of your app will be in sync. Defaults to []
    }),
    createPersistedState({
      key: 'w3',
      paths: ['user.GoTrueAuth'],
      reducer (val) {
        if(!val.user.GoTrueAuth) { // return empty state when user logged out
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