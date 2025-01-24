import { objSort, useTitleSearch } from '@/helpers/shared.js'

const defaultFilters = [
  { key: 'all', name: 'All Items', mode: 'all' },
  { key: 'movie', name: 'Movies', mode: 'all' },
  { key: 'series', name: 'Series', mode: 'all' }
]

export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      filterEnabled: true,
      filterMode: [...defaultFilters],
      listSearchMode: '',
      searchActive: false,
      searchTerm: '',
      sortMode: [
        { key: 'date', name: 'Date Added', order: 'ascending' },
        { key: 'date', name: 'Date Added', order: 'descending' },
        { key: 'rating', name: 'Rating', order: 'ascending' },
        { key: 'rating', name: 'Rating', order: 'descending' },
        { key: 'year', name: 'Release', order: 'ascending' },
        { key: 'year', name: 'Release', order: 'descending' },
        { key: 'title', name: 'Title', order: 'ascending' },
        { key: 'title', name: 'Title', order: 'descending' }
      ],
      tracklistFiltered: -1,
      tracklistSorted: -1,
      watchlistFiltered: -1,
      watchlistSorted: -1
    }
  },

  getters: {
    filterActive: state => state.tracklistFiltered > 0 || state.watchlistFiltered > 0,
    filterEnabled: state => state.filterEnabled,
    filterMode: state => state.filterMode,
    listSearchMode: state => state.listSearchMode,
    searchActive: state => state.searchActive,
    searchTerm: state => state.searchTerm,
    sortMode: state => state.sortMode,
    tracklistFiltered: state => state.tracklistFiltered,
    tracklistSorted: state => state.tracklistSorted,
    watchlistFiltered: state => state.watchlistFiltered,
    watchlistSorted: state => state.watchlistSorted
  },

  mutations: {
    SET_FILTER_ENABLED(state, value) {
      state.filterEnabled = value
    },
    SET_FILTER_MODE(state, value) {
      state.filterMode = value
    },
    SET_LIST_SEARCH_MODE(state, value) {
      state.listSearchMode = value
    },
    SET_SEARCH_ACTIVE(state, value) {
      state.searchActive = value
    },
    SET_SEARCH_TERM(state, value) {
      state.searchTerm = value
    },
    SET_TRACKLIST_FILTERED(state, value) {
      state.tracklistFiltered = value
    },
    SET_TRACKLIST_SORTED(state, value) {
      state.tracklistSorted = value
    },
    SET_WATCHLIST_FILTERED(state, value) {
      state.watchlistFiltered = value
    },
    SET_WATCHLIST_SORTED(state, value) {
      state.watchlistSorted = value
    }
  },

  actions: {
    initializeTools({ commit }) {
      commit('SET_FILTER_ENABLED', true)
      commit('SET_FILTER_MODE', [...defaultFilters])
      commit('SET_LIST_SEARCH_MODE', '')
      commit('SET_SEARCH_ACTIVE', false)
      commit('SET_SEARCH_TERM', '')
      commit('SET_TRACKLIST_FILTERED', -1)
      commit('SET_TRACKLIST_SORTED', -1)
      commit('SET_WATCHLIST_FILTERED', -1)
      commit('SET_WATCHLIST_SORTED', -1)
    },

    filterList({ commit, dispatch, getters, rootGetters }, args) {
      const [filterId, mode] = args // [Number, String]
      const filterMode = getters['filterMode']
      let filtered = []

      const doFilter = () => {
        const cache = rootGetters[`list/${mode}Cache`]
        const filterSearch = getters['searchActive']
        const filterSearchTerm = getters['searchTerm']
        const key = filterMode[filterId].key

        let filterFn = undefined
        let input = filterSearch ? useTitleSearch([...cache], filterSearchTerm) : cache // should it filter search results?

        if (input.length <= 0) {
          return []
        }

        switch (key) {
          case 'all':
            filterFn = el => el.id.length > 0
            break

          case 'movie':
          case 'series':
            filterFn = el => el.type && el.type.toLowerCase() === key
            break

          case 'watching':
            filterFn = el => el.watching && el.watching === true
            break

          case 'notwatching':
            filterFn = el => {
              if (el.type.toLowerCase() !== 'series') return false
              return el.hasOwnProperty('watching') ? el.watching !== true : true
            }
            break
        }

        if (!filterFn || typeof filterFn !== 'function') {
          return []
        }

        return [...input].filter(el => filterFn(el))
      }

      filtered = doFilter()

      commit(`list/SET_${mode.toUpperCase()}`, filtered, { root: true })
      commit(`SET_${mode.toUpperCase()}_FILTERED`, filterId)

      if (filtered.length > 0) {
        dispatch('updateSort', mode)
      }
    },

    resetList({ commit, dispatch, getters, rootGetters }, args) {
      const [listMode, resetMode] = args
      const mode = listMode ? listMode : getters['listSearchMode']
      const cache = rootGetters[`list/${mode}Cache`]
      const filterActive = getters[`${mode}Filtered`] > 0
      const searchActive = getters['searchActive']
      const searchTerm = getters['searchTerm']

      commit('SET_FILTER_ENABLED', true)

      if (resetMode !== 1) {
        commit('SET_SEARCH_ACTIVE', false)
        commit('SET_SEARCH_TERM', '')
      }

      if (filterActive && resetMode !== 1) {
        dispatch('updateFilter', mode)
      } else {
        const restored = searchActive ? useTitleSearch([...cache], searchTerm) : cache
        commit(`SET_${mode.toUpperCase()}_FILTERED`, 0)
        commit(`list/SET_${mode.toUpperCase()}`, restored, { root: true })
        dispatch('updateSort', mode) // reads from cache, needs sorting
      }
    },

    searchList({ commit, dispatch, getters, rootGetters }, args) {
      const [term, mode] = args // [String, String]
      const filterActive = getters[`${mode}Filtered`] > 0
      const input = rootGetters[`list/${mode}Cache`]

      commit('SET_LIST_SEARCH_MODE', mode)
      commit('SET_SEARCH_ACTIVE', true)
      commit('SET_SEARCH_TERM', term)

      let results = useTitleSearch(input, term)

      if (results.length <= 1) {
        commit('SET_FILTER_ENABLED', false)
      } else {
        commit('SET_FILTER_ENABLED', true)
      }

      if (filterActive) {
        dispatch('updateFilter', mode)
      } else {
        commit(`list/SET_${mode.toUpperCase()}`, results, { root: true })
        dispatch('updateSort', mode) // search results come from the cache, thus in need of sorting
      }
    },

    sortList({ commit, getters, rootGetters }, args) {
      const [sortID, mode] = args // [Number, String]
      const sortMode = getters['sortMode']

      const doSort = () => {
        const cache = rootGetters[`list/${mode}Cache`]
        const key = sortMode[sortID].key
        const list = rootGetters[`list/${mode}`]
        const order = sortMode[sortID].order
        const sortFiltered = getters['filterActive']
        const sortSearch = getters['searchActive']

        let input = sortFiltered || sortSearch ? list : cache // should it sort search results?
        let sorted = []

        switch (key) {
          case 'date':
            if (order === 'ascending') {
              sorted = [...input].sort(objSort('refId', false))
            } else if (order === 'descending') {
              sorted = [...input].sort(objSort('refId', true))
            }
            break

          case 'title':
            if (order === 'ascending') {
              sorted = [...input].sort(objSort(key, false, (a) =>  a.toLowerCase()))
            } else if (order === 'descending') {
              sorted = [...input].sort(objSort(key, true, (a) =>  a.toLowerCase()))
            }
            break

          case 'rating':
            const modeRating = mode === 'tracklist' ? 'userRating' : 'imdbRating'
            if (order === 'ascending') {
              sorted = [...input].sort(objSort(`${modeRating}`, false))
            } else if (order === 'descending') {
              sorted = [...input].sort(objSort(`${modeRating}`, true))
            }
            break

          case 'year':
            if (order === 'ascending') {
              sorted = [...input].sort(objSort(key, false))
            } else if (order === 'descending') {
              sorted = [...input].sort(objSort(key, true))
            }
            break
        }
        return sorted
      }

      commit(`list/SET_${mode.toUpperCase()}`, doSort(), { root: true })
      commit(`SET_${mode.toUpperCase()}_SORTED`, sortID)
    },

    updateFilter({ dispatch, getters }, mode) {
      const filterId = getters[`${mode}Filtered`]
      if (filterId > 0) {
        dispatch('filterList', [filterId, mode])
      }
    },

    updateFilterMode({ commit }, watching) {
      const wFilters = watching ? [
        ...defaultFilters,
        { key: 'watching', name: 'Currently Watching', mode: 'watchlist' },
        { key: 'notwatching', name: 'Not Watching', mode: 'watchlist' }
      ] : [...defaultFilters]
      commit('SET_FILTER_MODE', wFilters)
    },

    updateSort({ dispatch, getters, rootGetters }, mode) {
      const current = getters[`${mode}Sorted`]
      const preset = rootGetters['user/sortPreset']
      const sortId = current === -1 ? preset : current

      dispatch('sortList', [sortId, mode])
    }
  }
}