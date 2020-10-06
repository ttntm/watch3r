export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      listSearchMode: '',
      searchActive: false,
      searchStatus: '',
      sortMode: [
        { key: 'date', order: 'ascending' },     // 0
        { key: 'date', order: 'descending' },    // 1
        { key: 'title', order: 'ascending' },    // 2
        { key: 'title', order: 'descending' }    // 3
      ],
      tracklistSorted: -1,
      watchlistSorted: -1,
    };
  },

  getters: {
    searchActive: state => state.searchActive,
    listSearchMode: state => state.listSearchMode,
    searchStatus: state => state.searchStatus,
    sortMode: state => state.sortMode,
    tracklistSorted: state => state.tracklistSorted,
    watchlistSorted: state => state.watchlistSorted,
  },

  mutations: {
    SET_SEARCH_ACTIVE(state, value) {
      state.searchActive = value;
    },
    SET_LIST_SEARCH_MODE(state, value) {
      state.listSearchMode = value;
    },
    SET_SEARCH_STATUS(state, value) {
      state.searchStatus = value;
    },
    SET_TRACKLIST_SORTED(state, value) {
      state.tracklistSorted = value;
    },
    SET_WATCHLIST_SORTED(state, value) {
      state.watchlistSorted = value;
    },
  },

  actions: {
    /**
     *  COMMON ACTIONS
     */

    resetList({ commit, dispatch, getters, rootGetters }) {
      const mode = getters['listSearchMode'];
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

      dispatch('updateSort', mode); // reads from cache, needs sorting
    },

    updateSort({ dispatch, getters, rootGetters }, mode) {
      const current = getters[`${mode}Sorted`];
      const preset = rootGetters['user/sortPreset'];

      const sortId = current === -1 ? preset : current;

      dispatch('sortList', [sortId, mode]);
    },

    /**
     *  SEARCH OPERATION
     */

    searchList({ commit, dispatch, rootGetters }, args) {
      const [term, mode] = args; // [String, String]

      commit('SET_SEARCH_ACTIVE', true);
      commit('SET_LIST_SEARCH_MODE', mode);

      const getInput = () => {
        // returns the respective list as Object[] from the store
        // always search based on cache, otherwise results will be incomplete = wrong
        return rootGetters[`list/${mode}Cache`];
      }

      const search = (term) => {
        let input = getInput();
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
        commit('SET_SEARCH_STATUS', `Showing ${results} of ${getInput().length} listed titles.`);
      }

      if (mode === 'tracklist') {
        commit('list/SET_TRACKLIST', search(term), { root: true });
      }
      if (mode === 'watchlist') {
        commit('list/SET_WATCHLIST', search(term), { root: true });
      }

      dispatch('updateSort', mode); // search results come from the cache, thus in need of sorting
    },

    /**
     *  SORT OPERATION
     */

    sortList({ commit, getters, rootGetters }, args) {
      const [sortID, mode] = args; // [Number, String]
      const sortMode = getters['sortMode'];

      //generic sorting function for object keys
      const objSort = (field, reverse, primer) => {
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

      const doSort = () => {
        const key = sortMode[sortID].key;
        const order = sortMode[sortID].order;
        let sorted = [];

        const cache = rootGetters[`list/${mode}Cache`];
        const list = rootGetters[`list/${mode}`];
        const sortSearch = getters['searchActive'];

        const input = sortSearch ? list : cache; // should it sort search results?

        switch(key) {
          case 'date':
            if(order === 'ascending') {
              sorted = [...input].sort(objSort('refId', false));
            }
            if(order === 'descending') {
              sorted = [...input].sort(objSort('refId', true));
            }
            break;

          case 'title':
            if(order === 'ascending') {
              sorted = [...input].sort(objSort('title', false, (a) =>  a.toLowerCase()));
            }
            if(order === 'descending') {
              sorted = [...input].sort(objSort('title', true, (a) =>  a.toLowerCase()));
            }
            break;
        }
        return sorted;
      }

      if (mode === 'tracklist') {
        commit('list/SET_TRACKLIST', doSort(), { root: true });
        commit('SET_TRACKLIST_SORTED', sortID);
      }
      if (mode === 'watchlist') {
        commit('list/SET_WATCHLIST', doSort(), { root: true });
        commit('SET_WATCHLIST_SORTED', sortID);
      }
    }
  }
};