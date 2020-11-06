export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      recList: [],
      recSource: {}
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
      commit('SET_REC_SOURCE', {});
    },

    async getRecommendations({ commit, dispatch, rootGetters }, titleData) {
      const fn = rootGetters['app/functions'];
      let response;

      try {
        const data = await fetch(fn.tmdbGetRecs, { body: JSON.stringify(titleData), method: 'POST' });
        response = await data.json();
      } catch(err) {
        console.error("TMDB API error [getRecommendations()]", err);
      }

      if (response) {
        commit('SET_REC_LIST', response.results);
      } else {
        dispatch('app/sendToastMessage', { text: `Error fetching recommendations. Please try again later.`, type: 'error' }, { root: true });
      }
    },

    updateRecSource({ commit }, title) {
      commit('SET_REC_SOURCE', title);
    }
  }
};
