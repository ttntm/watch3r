import { getAuthHeaders } from '@/helpers/shared.js'

export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      editTitleContent: null,
      tracklist: [],
      tracklistCache: [],
      watchlist: [],
      watchlistCache: [],
      writeSuccess: false,
    }
  },

  getters: {
    editTitleContent: state => state.editTitleContent,
    tracklist: state => state.tracklist,
    tracklistCache: state => state.tracklistCache,
    watchlist: state => state.watchlist,
    watchlistCache: state => state.watchlistCache,
    writeSuccess: state => state.writeSuccess,
  },

  mutations: {
    SET_EDIT_TITLE_CONTENT(state, value) {
      state.editTitleContent = value
    },
    SET_WATCHLIST(state, value) {
      state.watchlist = value
    },
    SET_WATCHLIST_CACHE(state, value) {
      state.watchlistCache = value
    },
    SET_TRACKLIST(state, value) {
      state.tracklist = value
    },
    SET_TRACKLIST_CACHE(state, value) {
      state.tracklistCache = value
    },
    SET_WRITE_SUCCESS(state, value) {
      state.writeSuccess = value
    },
  },

  actions: {
    initializeList({ commit, state }) {
      commit('SET_EDIT_TITLE_CONTENT', null)
      commit('SET_TRACKLIST', [])
      commit('SET_TRACKLIST_CACHE', [])
      commit('SET_WATCHLIST', [])
      commit('SET_WATCHLIST_CACHE', [])
      commit('SET_WRITE_SUCCESS', false)
    },

    toggleWriteSuccess({ commit }, newState) {
      commit('SET_WRITE_SUCCESS', newState)
    },

    /**
     *  CREATE OPERATIONS
     */

    async writeList({ dispatch, rootGetters }, args) {
      const [titleData, mode] = args // [Object, String]
      const fn = rootGetters['app/functions']
      let response

      try {
        const reqHeaders = await getAuthHeaders()
        const data = await fetch(`${fn.api}/${mode}`, {
          body: JSON.stringify(titleData),
          headers: reqHeaders,
          method: 'POST'
        })
        response = await data.json()
      } catch (err) {
        console.error(err)
      }

      if (response) {
        dispatch('readList', mode)
        dispatch('toggleWriteSuccess', true)
        dispatch('app/sendToastMessage', { text: `"${response.data.title}" successfully added to ${mode}.`, type: 'success' }, { root: true })
      } else {
        // error
        dispatch('app/sendToastMessage', { text: `An error occurred. Please try again later.`, type: 'error' }, { root: true })
      }
    },

    /**
     *  READ OPERATIONS
     */

    async readList({ commit, dispatch, getters, rootGetters }, mode) {
      const filterActive = rootGetters[`tools/${mode}Filtered`] > 0
      const fn = rootGetters['app/functions']
      const searchActive = rootGetters['tools/searchActive']
      const searchMode = rootGetters['tools/listSearchMode']
      const user = rootGetters['user/currentUser']
      let response

      try {
        const reqHeaders = await getAuthHeaders()
        const data = await fetch(`${fn.api}/${mode}/${user.id}`, { method: 'GET', headers: reqHeaders })
        response = await data.json()
      } catch (err) {
        console.error(err)
      }

      if (response) {
        const list = response.map(item => {
          let temp = Object.assign({}, item.data)
          temp.refId = item.ref['@ref'].id
          return temp
        })

        // always cache the new data, so we can restore it without another DB query in case search is active
        commit(`SET_${mode.toUpperCase()}_CACHE`, list)

        if (!filterActive && (!searchActive || searchMode !== mode)) {
          // search not active OR active for another list mode -> set the display list data
          // careful: not checking mode here could lead to stale data due to ASYNC race conditions, i.e. tracklist-read completed before watchlist-search was cleared...
          commit(`SET_${mode.toUpperCase()}`, list)
        } else {
          // search is active, check whether there are results left
          // with search active, the respective current list === the search results
          const activeSearchResults = getters[`${mode}`]
          
          if (activeSearchResults.length === 0) {
            // no results left to display -> reset search
            dispatch('tools/resetList', null, { root: true })
          }
        }

        if (list.length > 0 && filterActive) {
          dispatch('tools/updateFilter', mode, { root: true })
        }

        if (list.length > 0 && (!filterActive && (!searchActive || searchMode !== mode))) {
          dispatch('tools/updateSort', mode, { root: true })
        }
      } else {
        // no 'response' = error
        dispatch('app/sendToastMessage', { text: `An error occurred loading the ${mode}. Please try again later.`, type: 'error' }, { root: true })
      }
    },

    /**
     *  UPDATE OPERATIONS
     */

    clearEditTitle({ commit }) {
      commit('SET_EDIT_TITLE_CONTENT', null)
    },

    async editListItem({ dispatch, rootGetters }, args) {
      const fn = rootGetters['app/functions']
      const [updatedTitleData, mode] = args
      const searchActive = rootGetters['tools/searchActive']
      const searchMode = rootGetters['tools/listSearchMode']
      let response

      try {
        const reqHeaders = await getAuthHeaders()
        const data = await fetch(`${fn.api}/${mode}/${updatedTitleData.refId}`, {
          body: JSON.stringify(updatedTitleData),
          headers: reqHeaders,
          method: 'PUT'
        })
        response = await data.json()
      } catch (err) {
        console.error(err)
      }

      if (response) {
        dispatch('readList', mode)
        dispatch('toggleWriteSuccess', true)

        if (updatedTitleData.hasOwnProperty('watching') && searchActive && searchMode === 'watchlist') {
          dispatch('updateWatchingState', updatedTitleData.id)
        }

        dispatch('app/sendToastMessage', { text: `"${response.data.title}" successfully updated.`, type: 'success' }, { root: true })
      } else {
        // error
        dispatch('app/sendToastMessage', { text: `An error occurred. Please try again later.`, type: 'error' }, { root: true })
      }
    },

    selectEditTitle({ commit, getters }, args) {
      const [id, mode] = args // [String, Number]

      const getItem = id => {
        let content = getters[`${mode}`]
        content = content.filter(item => item.refId === id)
        return content[0]
      }

      commit('SET_EDIT_TITLE_CONTENT', getItem(id))
    },

    updateSearchResult({ commit, getters, rootGetters }, data) {
      const mode = rootGetters['tools/listSearchMode']
      const searchResults = getters[`${mode}`]

      let listUpdate = []

      switch (mode) {
        case 'tracklist':
          listUpdate = searchResults.map(item => {
            if (item.refId === data.refId) {
              item = Object.assign({}, data)
            }
            return item
          })
          break

        case 'watchlist':
          listUpdate = searchResults.filter(item => item.refId !== data.refId)
          break
      }

      commit(`SET_${mode.toUpperCase()}`, listUpdate)
    },

    updateWatchingState({ commit, getters }, itemId) {
      const searchResults = getters['watchlist']
      let listUpdate = searchResults.map(item => {
        if (item.id === itemId) {
          item.watching = !item.watching
        }
        return item
      })
      commit('SET_WATCHLIST', listUpdate)
    },

    /**
     *  DELETE OPERATIONS
     */

    deleteFromSearchResults({ commit, getters }, args) {
      const [id, mode] = args
      const searchResults = getters[`${mode}`]

      const listUpdate = searchResults.filter(item => item.refId !== id)

      commit(`SET_${mode.toUpperCase()}`, listUpdate)
    },

    async deleteItem({ dispatch, rootGetters }, args) {
      const [id, mode, silent] = args // [String, String, Boolean]
      const fn = rootGetters['app/functions']
      let msg = {}
      let response

      try {
        const reqHeaders = await getAuthHeaders()
        const data = await fetch(`${fn.api}/${mode}`, {
          body: JSON.stringify({ item: id }),
          headers: reqHeaders,
          method: 'DELETE'
        })
        response = await data.json()
      } catch (err) {
        console.error(err)
      }

      if (response) {
        msg = { text: `Item removed from ${mode}.`, type: 'success' }
        dispatch('readList', mode)
      } else {
        // no 'response' -> error
        msg = { text: `Couldn't delete item from ${mode}. Please try again later.`, type: 'error' }
      }

      return silent ? console.log(msg) : dispatch('app/sendToastMessage', msg, { root: true })
    }
  }
}