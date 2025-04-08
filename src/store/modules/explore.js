import { getAuthHeaders } from '@/helpers/shared.js'

export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      recList: [],
      recMode: '',
      recSource: {}
    }
  },

  getters: {
    recList: state => state.recList,
    recMode: state => state.recMode,
    recSource: state => state.recSource
  },

  mutations: {
    SET_REC_LIST(state, value) {
      state.recList = value
    },
    SET_REC_MODE(state, value) {
      state.recMode = value
    },
    SET_REC_SOURCE(state, value) {
      state.recSource = value
    }
  },

  actions: {
    initializeExplore({ dispatch }) {
      dispatch('clearRecommendations')
      dispatch('updateRecSource', {})
    },

    clearRecommendations({ commit }) {
      commit('SET_REC_LIST', [])
    },

    async getRecommendations({ commit, dispatch, rootGetters }, titleData) {
      const fn = rootGetters['app/functions']
      let response

      try {
        const reqHeaders = await getAuthHeaders()
        const data = await fetch(fn.tmdbGetRecs, {
          body: JSON.stringify(titleData),
          method: 'POST',
          headers: reqHeaders
        })

        response = await data.json()
      } catch(err) {
        console.error("TMDB API error [getRecommendations()]", err)
      }

      if (response) {
        if (response.total_results > 0) {
          commit('SET_REC_LIST', response.results)
        } else {
          dispatch('updateRecSource', {})
          dispatch('app/sendToastMessage', { text: `TMDb couldn't find recommendations for your selection, sorry.`, type: 'error' }, { root: true })
        }
      } else {
        dispatch('app/sendToastMessage', { text: `Error fetching recommendations. Please try again later.`, type: 'error' }, { root: true })
      }
    },

    updateRecMode({ commit }, mode) {
      commit('SET_REC_MODE', mode)
    },

    updateRecSource({ commit, dispatch, getters }, title) {
      const current = getters['recSource']
      const isCurrent = Boolean(current.id === title.id)

      if (!isCurrent) {
        dispatch('clearRecommendations')
        commit('SET_REC_SOURCE', title)

        if (typeof title === 'object' && (title.id && title.type)) {
          dispatch('getRecommendations', {
            id: title.id,
            type: title.type
          })
        }
      }
    }
  }
}
