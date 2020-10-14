export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      listSearchMode: '',
      searchActive: false,
      sortMode: [
        { key: 'date', name: 'Date Added', order: 'ascending' },
        { key: 'date', name: 'Date Added', order: 'descending' },
        { key: 'rating', name: 'Rating', order: 'ascending' },
        { key: 'rating', name: 'Rating', order: 'descending' },
        { key: 'year', name: 'Release', order: 'ascending' },
        { key: 'year', name: 'Release', order: 'descending' },
        { key: 'title', name: 'Title', order: 'ascending' },
        { key: 'title', name: 'Title', order: 'descending' },
      ],
      tracklistSorted: -1,
      watchlistSorted: -1,
    };
  },

  getters: {
    searchActive: state => state.searchActive,
    listSearchMode: state => state.listSearchMode,
    sortMode: state => state.sortMode,
    tracklistSorted: state => state.tracklistSorted,
    watchlistSorted: state => state.watchlistSorted,
  },

  mutations: {
    SET_LIST_SEARCH_MODE(state, value) {
      state.listSearchMode = value;
    },
    SET_SEARCH_ACTIVE(state, value) {
      state.searchActive = value;
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

    initializeTools({ commit }) {
      commit('SET_LIST_SEARCH_MODE', '');
      commit('SET_SEARCH_ACTIVE', false);
      commit('SET_TRACKLIST_SORTED', -1);
      commit('SET_WATCHLIST_SORTED', -1);
    },

    resetList({ commit, dispatch, getters, rootGetters }) {
      const mode = getters['listSearchMode'];
      let cache;

      commit('SET_SEARCH_ACTIVE', false);

      cache = rootGetters[`list/${mode}Cache`];

      commit(`list/SET_${mode.toUpperCase()}`, cache, { root: true });
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

      commit(`list/SET_${mode.toUpperCase()}`, search(term), { root: true });
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
            } else if(order === 'descending') {
              sorted = [...input].sort(objSort('refId', true));
            }
            break;

          case 'title':
            if(order === 'ascending') {
              sorted = [...input].sort(objSort(key, false, (a) =>  a.toLowerCase()));
            } else if(order === 'descending') {
              sorted = [...input].sort(objSort(key, true, (a) =>  a.toLowerCase()));
            }
            break;

          case 'rating':
            const modeRating = mode === 'tracklist' ? 'userRating' : 'imdbRating';
            if(order === 'ascending') {
              sorted = [...input].sort(objSort(`${modeRating}`, false));
            } else if(order === 'descending') {
              sorted = [...input].sort(objSort(`${modeRating}`, true));
            }
            break;

          case 'year':
            if(order === 'ascending') {
              sorted = [...input].sort(objSort(key, false));
            } else if(order === 'descending') {
              sorted = [...input].sort(objSort(key, true));
            }
            break;
        }
        return sorted;
      }

      commit(`list/SET_${mode.toUpperCase()}`, doSort(), { root: true });
      commit(`SET_${mode.toUpperCase()}_SORTED`, sortID);
    }
  }
};