import { getAuthHeaders } from '@/helpers/shared.js'

export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      recList: [],
      recSource: {}
    }
  },

  getters: {
    recList: state => state.recList,
    recSource: state => state.recSource
  },

  mutations: {
    SET_REC_LIST(state, value) {
      state.recList = value
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
        const data = await fetch(fn.tmdbGetRecs, { body: JSON.stringify(titleData), method: 'POST', headers: reqHeaders })
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

    updateRecSource({ commit }, title) {
      commit('SET_REC_SOURCE', title)
    }
  }
}
