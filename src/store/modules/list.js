export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      addTitleOpen: false,
      editTitleContent: null,
      editTitleOpen: false,
      tracklist: [],
      tracklistCache: [],
      watchlist: [],
      watchlistCache: [],
      writeSuccess: false,
    };
  },

  getters: {
    addTitleOpen: state => state.addTitleOpen,
    editTitleContent: state => state.editTitleContent,
    editTitleOpen: state => state.editTitleOpen,
    tracklist: state => state.tracklist,
    tracklistCache: state => state.tracklistCache,
    watchlist: state => state.watchlist,
    watchlistCache: state => state.watchlistCache,
    writeSuccess: state => state.writeSuccess,
  },

  mutations: {
    SET_ADD_TITLE_OPEN(state, value) {
      state.addTitleOpen = value;
    },
    SET_EDIT_TITLE_CONTENT(state, value) {
      state.editTitleContent = value;
    },
    SET_EDIT_TITLE_OPEN(state, value) {
      state.editTitleOpen = value;
    },
    SET_WATCHLIST(state, value) {
      state.watchlist = value;
    },
    SET_WATCHLIST_CACHE(state, value) {
      state.watchlistCache = value;
    },
    SET_TRACKLIST(state, value) {
      state.tracklist = value;
    },
    SET_TRACKLIST_CACHE(state, value) {
      state.tracklistCache = value;
    },
    SET_WRITE_SUCCESS(state, value) {
      state.writeSuccess = value;
    },
  },

  actions: {
    /**
     *  COMMON LIST ACTIONS
     */

    toggleAddTitleModal({ commit }, newState) {
      commit('SET_ADD_TITLE_OPEN', newState);
    },

    toggleEditTitleModal({ commit }, newState) {
      commit('SET_EDIT_TITLE_OPEN', newState);
    },

    toggleWriteSuccess({ commit }, newState) {
      commit('SET_WRITE_SUCCESS', newState);
    },

    /**
     *  CREATE OPERATIONS
     */

    async writeList({ dispatch, rootGetters }, args) {
      const fn = rootGetters['app/functions'];
      let msg = {};
      let response;
      const [titleData, mode] = args; // [Object, String]

      const getFn = (m) => {
        if (m === 'tracklist') {
          return fn.writeItemTracklist;
        }
        if (m === 'watchlist') {
          return fn.writeItemWatchlist;
        }
      }

      try {
        const data = await fetch(`${getFn(mode)}`, {
          body: JSON.stringify(titleData),
          method: 'POST'
        });
        response = await data.json();
      } catch (err) {
        console.error(err);
      }

      if (response) {
        msg = { text: `"${response.data.title}" successfully added to ${mode}.`, type: 'success' };
        dispatch('readList', mode);
        dispatch('toggleWriteSuccess', true);
        dispatch('app/sendToastMessage', msg, { root: true });
      } else {
        // error
        msg = { text: `An error occurred. Please try again later.`, type: 'error' };
        dispatch('app/sendToastMessage', msg, { root: true });
      }
    },

    /**
     *  READ OPERATIONS
     */

    readList({ commit, rootGetters }, mode) {
      const fn = rootGetters['app/functions'];
      const user = rootGetters['user/currentUser'];

      const getFn = (m) => {
        if (m === 'tracklist') {
          return fn.readTracklist;
        }
        if (m === 'watchlist') {
          return fn.readWatchlist;
        }
      }

      fetch(`${getFn(mode)}/${user.email}`, { method: 'POST' })
        .then(response => {
          return response.json();
        })
        .then(res => {
          const list = res.map((item) => {
            let temp = Object.assign({}, item.data); //create new object from DB data
            temp.refId = item.ref['@ref'].id; // add the database ID for edit/delete operations
            return temp; //return newly created temp object
          });
          if (mode === 'tracklist') {
            commit('SET_TRACKLIST', list);
            commit('SET_TRACKLIST_CACHE', list); //cache the current 'tracklist' data, so we can restore it without another DB query
          }
          if (mode === 'watchlist') {
            commit('SET_WATCHLIST', list);
            commit('SET_WATCHLIST_CACHE', list); //cache the current 'watchlist' data, so we can restore it without another DB query
          }
        })
    },

    /**
     *  UPDATE OPERATIONS
     */

    clearEditTitle({ commit }) {
      commit('SET_EDIT_TITLE_CONTENT', null);
    },

    async editListItem({ dispatch, rootGetters }, updatedTitleData) {
      const fn = rootGetters['app/functions'];
      let msg = {};
      let response;

      try {
        const data = await fetch(`${fn.updateTracklist}/${updatedTitleData.refId}`, {
          body: JSON.stringify(updatedTitleData),
          method: 'POST'
        });
        response = await data.json();
      } catch (err) {
        console.error(err);
      }

      if (response) {
        msg = { text: `"${response.data.title}" successfully updated.`, type: 'success' };
        dispatch('readList', 'tracklist');
        dispatch('toggleWriteSuccess', true);
        dispatch('app/sendToastMessage', msg, { root: true });
      } else {
        // error
        msg = { text: `An error occurred. Please try again later.`, type: 'error' };
        dispatch('app/sendToastMessage', msg, { root: true });
      }
    },

    selectEditTitle({ commit, getters }, args) {
      const [id, mode] = args; // [String, Number]

      const getInput = (mode) => {
          return getters[`${mode}`];
      }

      const getItem = (id) => {
        let content = getInput(mode);
        content = content.filter((item) => item.refId === id);
        return content[0];
      }

      commit('SET_EDIT_TITLE_CONTENT', getItem(id));
    },

    /**
     *  DELETE OPERATIONS
     */

    async deleteItem({ dispatch, rootGetters }, args) {
      const fn = rootGetters['app/functions'];
      const [id, mode, silent] = args; // [String, Number, Boolean]
      let msg = {};
      let response;

      const getFn = (m) => {
        if (m === 'tracklist') {
          return fn.deleteItemTracklist;
        }
        if (m === 'watchlist') {
          return fn.deleteItemWatchlist;
        }
      }

      try {
        const data = await fetch(`${getFn(mode)}/${id}`, { method: 'POST' });
        response = await data.json();
      } catch (err) {
        console.error(err);
      }

      if (response) {
        msg = { text: `Item removed from ${mode}.`, type: 'success' };
        dispatch('readList', mode);
      } else {
        // no 'response' -> error
        msg = { text: `Couldn't delete item from ${mode}. Please try again later.`, type: 'error' };
      }

      return silent ? console.log(msg) : dispatch('app/sendToastMessage', msg, { root: true });
    }
  }
};