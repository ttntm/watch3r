export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      isDevEnvironment: false,
      siteURL: 'watch3r.ttntm.me',
      menuOpen: false,
      toastMessage: null,
      functions: {
        // readAll: process.env.VUE_APP_F_ALL,
        // readOne: process.env.VUE_APP_F_ONE,
        // readByUser: process.env.VUE_APP_F_BYUSER,
        writeTracklist: process.env.VUE_APP_F_TRACKLIST_ADD,
        writeWatchlist: process.env.VUE_APP_F_WATCHLIST_ADD,
        // edit: process.env.VUE_APP_F_EDIT,
        // delete: process.env.VUE_APP_F_DELETE
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