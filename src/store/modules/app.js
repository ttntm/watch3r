export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      isDevEnvironment: false,
      siteURL: 'watch3r.app',
      menuOpen: false,
      toastMessage: null,
      functions: {
        deleteItemTracklist: process.env.VUE_APP_F_TRACKLIST_DEL,
        deleteItemWatchlist: process.env.VUE_APP_F_WATCHLIST_DEL,
        readTracklist: process.env.VUE_APP_F_TRACKLIST_GET,
        readWatchlist: process.env.VUE_APP_F_WATCHLIST_GET,
        updateTracklist: process.env.VUE_APP_F_TRACKLIST_EDT, // only tracklist has an 'update' function; watchlist can only add/delete
        writeItemTracklist: process.env.VUE_APP_F_TRACKLIST_ADD,
        writeItemWatchlist: process.env.VUE_APP_F_WATCHLIST_ADD,
      }
    };
  },

  getters: {
    isDevEnvironment: state => state.isDevEnvironment,
    siteURL: state => state.siteURL,
    menuOpen: state => state.menuOpen,
    toastMessage: state => state.toastMessage,
    functions: state => state.functions,
  },

  mutations: {
    SET_DEV_ENV(state, value) {
      state.isDevEnvironment = value;
    },
    SET_SITE_URL(state, value) {
      state.siteURL = value;
    },
    SET_MENU_OPEN(state, value) {
      state.menuOpen = value;
    },
    SET_TOAST_MESSAGE(state, value) {
      state.toastMessage = value;
    }
  },

  actions: {
    toggleMenu({ commit }, newState) {
      commit('SET_MENU_OPEN', newState);
    },

    /**
    * @param {object} message - a message object as required by ToastMeassage.vue with 2 keys, "text" and "type"
    */
    sendToastMessage({ commit }, message) {
      let timer;

      clearTimeout(timer);

      commit('SET_TOAST_MESSAGE', message);

      timer = setTimeout(() => {
        commit('SET_TOAST_MESSAGE', null);
      }, 5000);
    }
  }
};
