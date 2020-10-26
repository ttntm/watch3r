export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      addTitleOpen: false,
      editTitleOpen: false,
      posterOpen: false,
      isDevEnvironment: false,
      siteURL: 'watch3r.app',
      menuOpen: false,
      toastMessage: null,
      functions: {
        deleteItemTracklist: process.env.VUE_APP_F_TRACKLIST_DEL,
        deleteItemWatchlist: process.env.VUE_APP_F_WATCHLIST_DEL,
        omdbGet: process.env.VUE_APP_F_OMDB_GET,
        readTracklist: process.env.VUE_APP_F_TRACKLIST_GET,
        readWatchlist: process.env.VUE_APP_F_WATCHLIST_GET,
        updateTracklist: process.env.VUE_APP_F_TRACKLIST_EDT, // only tracklist has an 'update' function; watchlist can only add/delete
        writeItemTracklist: process.env.VUE_APP_F_TRACKLIST_ADD,
        writeItemWatchlist: process.env.VUE_APP_F_WATCHLIST_ADD,
      }
    };
  },

  getters: {
    addTitleOpen: state => state.addTitleOpen,
    editTitleOpen: state => state.editTitleOpen,
    posterOpen: state => state.posterOpen,
    isDevEnvironment: state => state.isDevEnvironment,
    siteURL: state => state.siteURL,
    menuOpen: state => state.menuOpen,
    toastMessage: state => state.toastMessage,
    functions: state => state.functions,
  },

  mutations: {
    SET_ADD_TITLE_OPEN(state, value) {
      state.addTitleOpen = value;
    },
    SET_DEV_ENV(state, value) {
      state.isDevEnvironment = value;
    },
    SET_EDIT_TITLE_OPEN(state, value) {
      state.editTitleOpen = value;
    },
    SET_POSTER_OPEN(state, value) {
      state.posterOpen = value;
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
    closeAllModals({ dispatch }) {
      dispatch('toggleAddTitleModal', false);
      dispatch('toggleEditTitleModal', false);
      dispatch('togglePosterModal', false);
      dispatch('toggleMenu', false);
    },

    initialize({ dispatch }) {
      // global state reset action triggering module actions to keep things separate
      dispatch('list/initializeList', null, { root: true });
      dispatch('tools/initializeTools', null, { root: true });
      dispatch('user/initializeUser', null, { root: true });
    },

    toggleAddTitleModal({ commit }, newState) {
      commit('SET_ADD_TITLE_OPEN', newState);
    },

    toggleEditTitleModal({ commit }, newState) {
      commit('SET_EDIT_TITLE_OPEN', newState);
    },

    togglePosterModal({ commit }, newState) {
      commit('SET_POSTER_OPEN', newState);
    },

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
