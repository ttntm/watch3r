import GoTrue from 'gotrue-js';

export default {
  strict: false,
  namespaced: true,
  state() {
    return {
      currentUser: null,
      GoTrueAuth: null,
      userOptions: {
        showIMDbLinks: true,
        sortPreset: 1, // array index based on store.getters['tools/sortMode']
        startPage: 0 // 0 -> watchlist | 1 -> tracklist
      }
    };
  },
  getters: {
    loggedIn: state => !!state.currentUser,
    currentUser: state => state.currentUser,
    GoTrueAuth: state => state.GoTrueAuth,
    showIMDbLinks: state => state.userOptions.showIMDbLinks,
    sortPreset: state => state.userOptions.sortPreset,
    startPage: state => state.userOptions.startPage,
    userOptions: state => state.userOptions,
  },
  mutations: {
    SET_CURRENT_USER(state, value) {
      state.currentUser = value;
    },
    SET_GOTRUE(state, value) {
      state.GoTrueAuth = value;
    },
    SET_IMDB_LINKS(state, value) {
      state.userOptions.showIMDbLinks = value;
    },
    SET_SORT_PRESET(state, value) {
      state.userOptions.sortPreset = value;
    },
    SET_START_PAGE(state, value) {
      state.userOptions.startPage = value;
    }
  },
  actions: {
    initializeUser({ commit, dispatch }) {
      commit('SET_IMDB_LINKS', true);
      commit('SET_SORT_PRESET', 1);
      commit('SET_START_PAGE', 0);
      // re-initialize GoTrue
      commit('SET_GOTRUE', null);
      dispatch('initAuth');
    },

    attemptConfirmation({ state }, token) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.confirm(token)
          .then(response => {
            resolve(response); // User confirmed
          })
          .catch(error => {
            console.error("An error occurred trying to confirm the user", error);
            reject(error);
          });
      });
    },

    attemptLogin({ commit, dispatch, state }, credentials) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.login(credentials.email, credentials.password, true)
          .then(response => {
            commit("SET_CURRENT_USER", response);
            dispatch('setUserPrefs', response);
            resolve(response);
          })
          .catch(error => {
            console.error("An error occurred logging in", error);
            store.dispatch('app/sendToastMessage', { text: `Something's gone wrong logging in, please try again later.`, type: 'error' }, { root: true });
            reject(error);
          });
      });
    },

    attemptLogout({ commit, dispatch, state }) {
      return new Promise((resolve, reject) => {
        const user = state.GoTrueAuth.currentUser();
        user
          .logout()
          .then(response => {
            //console.log("User logged out", response);
            commit("SET_CURRENT_USER", null);
            dispatch('app/initialize', null, { root: true });
            resolve(response);
          })
          .catch(error => {
            console.error("Could not log user out", error);
            commit("SET_CURRENT_USER", null);
            reject(error);
          });
      });
    },

    attemptPasswordRecovery({ state, commit }, token) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.recover(token)
          .then(response => {
            commit("SET_CURRENT_USER", response);
            resolve(response);
          })
          .catch(error => {
            console.error("Failed to verify recover token: %o", error);
            reject(error);
          });
      });
    },

    attemptSignup({ getters, state }, credentials) {
      const userOptions = getters['userOptions'];
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.signup(credentials.email, credentials.password, {
          // set defaults
          user_imdb: userOptions.showIMDbLinks,
          user_sort: userOptions.userSort,
          user_start: userOptions.userStart
        })
          .then(response => {
            resolve(response); // Confirmation email sent
          })
          .catch(error => {
            console.error("An error occurred trying to sign up", error);
            reject(error);
          });
      });
    },

    initAuth({ commit, rootGetters }) {
      const APIUrl = `https://${rootGetters["app/siteURL"]}/.netlify/identity`;

      const initNewGoTrue = APIUrl => {
        return new GoTrue({
          APIUrl: APIUrl,
          setCookie: true
        });
      };

      commit("SET_GOTRUE", initNewGoTrue(APIUrl));
    },

    processInvite({ state }, data) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.acceptInvite(data.token, data.pwd)
          .then(response => {
            resolve(response); // invite successfull, user created
          })
          .catch(error => {
            console.error("An error occurred trying to process the invite", error);
            reject(error);
          });
      });
    },

    requestPasswordRecover({ dispatch, state }, email) {
      state.GoTrueAuth.requestPasswordRecovery(email)
        .then(response => {
          dispatch('app/sendToastMessage', { text: `Recovery email sent.`, type: 'success' }, { root: true });
          resolve(response);
        })
        .catch(error => {
          console.error(`Error sending recovery email`, error);
          dispatch('app/sendToastMessage', { text: `Error sending recovery email, please try again later.`, type: 'error' }, { root: true });
          reject(error);
        });
    },

    updateUserAccount({ dispatch, state }, userData) {
      return new Promise((resolve, reject) => {
        const user = state.GoTrueAuth.currentUser();
        user
          .update(userData)
          .then(response => {
            dispatch('setUserPrefs', response);
            dispatch('app/sendToastMessage', { text: `Profile successfully updated.`, type: 'success' }, { root: true });
            resolve(response);
          })
          .catch(error => {
            console.error(`Error updating the user profile`, error);
            dispatch('app/sendToastMessage', { text: `Error updating the user profile, please try again later.`, type: 'error' }, { root: true });
            reject(error);
          });
      });
    },

    setUserPrefs({ commit, dispatch, getters }, data) {
      const user = data;
      const userMeta = user.user_metadata;
      const userOptions = getters['userOptions'];

      if (!Object.keys(userMeta).length > 0) {
        // user has no preferences
        let userUpdate = {
          email: user.email,
          data: {
            user_imdb: userOptions.showIMDbLinks,
            user_sort: userOptions.userSort,
            user_start: userOptions.userStart
          }
        };
        dispatch('updateUserAccount', userUpdate);
      } else {
        // user preferences are available
        commit('SET_IMDB_LINKS', userMeta.user_imdb);
        commit('SET_SORT_PRESET', userMeta.user_sort);
        commit('SET_START_PAGE', userMeta.user_start);
      }
    },
  }
};