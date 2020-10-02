export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      searchActive: false,
      searchMode: '',
      searchStatus: '',
    };
  },

  getters: {
    searchActive: state => state.searchActive,
    searchMode: state => state.searchMode,
    searchStatus: state => state.searchStatus,
  },

  mutations: {
    SET_SEARCH_ACTIVE(state, value) {
      state.searchActive = value;
    },
    SET_SEARCH_MODE(state, value) {
      state.searchMode = value;
    },
    SET_SEARCH_STATUS(state, value) {
      state.searchStatus = value;
    },
  },

  actions: {
    /**
     *  COMMON ACTIONS
     */

    /**
     *  SEARCH & SORT OPERATIONS
     */

    searchList({ commit, dispatch, rootGetters }, args) {
      const [term, mode] = args; // [String, String]

      commit('SET_SEARCH_ACTIVE', true);
      commit('SET_SEARCH_MODE', mode);

      const getInput = (mode) => {
        // returns the respective list as Object[] from the store
        // always search based on cache, otherwise results will be incomplete = wrong
        return rootGetters[`list/${mode}Cache`];
      }

      const search = (term) => {
        let input = getInput(mode);
        term = term.toLowerCase();
        return input.filter((item) => {
          let title = item.title.toLowerCase();
          let genre = item.genre.toLowerCase()

          if (title.indexOf(term) === -1) {
            return genre.indexOf(term) === -1 ? false : true
          } else {
            return true
          }
        })
      }

      let results = search(term).length;
      if (results === 0) {
        commit('SET_SEARCH_STATUS', 'No results.');
      } else {
        commit('SET_SEARCH_STATUS', `Showing ${results} of ${getInput(mode).length} listed titles.`);
      }

      if (mode === 'tracklist') {
        commit('list/SET_TRACKLIST', search(term), { root: true });
      }
      if (mode === 'watchlist') {
        commit('list/SET_WATCHLIST', search(term), { root: true });
      }
    },

    sortList({ commit, dispatch }, args) {},

    resetList({ commit, getters, rootGetters }) {
      const mode = getters['searchMode'];
      let cache;

      commit('SET_SEARCH_ACTIVE', false);

      if (mode === 'tracklist') {
        cache = rootGetters['list/tracklistCache'];
        commit('list/SET_TRACKLIST', cache, { root: true });
      }
      if (mode === 'watchlist') {
        cache = rootGetters['list/watchlistCache'];
        commit('list/SET_WATCHLIST', cache, { root: true });
      }
    }

  }
};