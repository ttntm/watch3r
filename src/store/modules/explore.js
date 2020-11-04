export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      recList: [],
      recSource: null
    };
  },

  getters: {
    recList: state => state.recList,
    recSource: state => state.recSource
  },

  mutations: {
    SET_REC_LIST(state, value) {
      state.recList = value;
    },
    SET_REC_SOURCE(state, value) {
      state.recSource = value;
    }
  },

  actions: {
    initializeExplore({ commit }) {
      commit('SET_REC_LIST', []);
      commit('SET_REC_SOURCE', null);
    },

    getRecommendations({ commit, rootGetters }, titleData) {
      const fn = rootGetters['app/functions'];

      fetch(fn.tmdbGetRecs, { body: JSON.stringify(titleData), method: 'POST' })
        .then(response => {
          return response.json();
        })
        .then(res => {
          commit('SET_REC_LIST', res.results)
        })
        .catch((error) => {
          console.error("TMDB API error [getRecommendations()]", error);
        })
    },

    updateRecSource({ commit }, title) {
      commit('SET_REC_SOURCE', title);
    }
  }
};
