import { watch } from "vue";

export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      addTitleOpen: false,
      tracklist: [],
      tracklistCache: [],
      watchlist: [],
      watchlistCache: []
    };
  },

  getters: {
    addTitleOpen: state => state.addTitleOpen,
    tracklist: state => state.tracklist,
    tracklistCache: state => state.tracklistCache,
    watchlist: state => state.watchlist,
    watchlistCache: state => state.watchlistCache
  },

  mutations: {
    SET_ADD_TITLE_OPEN(state, value) {
      state.addTitleOpen = value;
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
  },

  actions: {
    // COMMON ACTIONS

    toggleAddTitleModal({ commit }, newState) {
      commit('SET_ADD_TITLE_OPEN', newState);
    },

    // CREATE OPERATIONS

    async writeList({ dispatch, rootGetters }, args) {
      const titleData = args[0];
      const mode = args[1];

      const fn = rootGetters['app/functions'];
      let responseData;

      const fnRead = (m) => {
        if (m === 'tracklist') {
          return fn.writeTracklist;
        }
        if (m === 'watchlist') {
          return fn.writeWatchlist;
        }
      }

      try {
        const data = await fetch(`${fnRead(mode)}`, {
          body: JSON.stringify(titleData),
          method: 'POST'
        });
        responseData = await data.json();
      } catch (err) {
        console.log(err);
      }

      if(responseData) {
        let msg = { text: `"${responseData.data.title}" successfully added.`, type: 'success' };
        dispatch('app/sendToastMessage', msg, { root: true });
        // update respective list; clear search result in modal somehow...
      }
    },

    // READ OPERATIONS

    readList({ commit, rootGetters }, mode) {
      const fn = rootGetters['app/functions'];
      const user = rootGetters['user/currentUser'];
      const fnRead = (m) => {
        if (m === 'tracklist') {
          return fn.readTracklist;
        }
        if (m === 'watchlist') {
          return fn.readWatchlist;
        }
      }
      fetch(`${fnRead(mode)}/${user.email}`, { method: 'POST' })
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
  }
};