export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      addTitleOpen: false,
    };
  },

  getters: {
    addTitleOpen: state => state.addTitleOpen,
  },

  mutations: {
    SET_ADD_TITLE_OPEN(state, value) {
      state.addTitleOpen = value;
    },
  },

  actions: {
    toggleAddTitleModal({ commit }, newState) {
      commit('SET_ADD_TITLE_OPEN', newState);
    },
  }
};