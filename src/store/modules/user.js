import GoTrue from 'gotrue-js';

export default {
  strict: false,
  namespaced: true,
  state() {
    return {
      currentUser: null,
      GoTrueAuth: null,
      userOptions: {
        showExploreLinks: true,
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
    showExploreLinks: state => state.userOptions.showExploreLinks,
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
    SET_EXPLORE_LINKS(state, value) {
      state.userOptions.showExploreLinks = value;
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
      commit('SET_EXPLORE_LINKS', true);
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
            console.error('An error occurred trying to confirm the user', error);
            reject(error);
          });
      });
    },

    attemptLogin({ commit, dispatch, state }, credentials) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.login(credentials.email, credentials.password, true)
          .then(response => {
            commit('SET_CURRENT_USER', response);
            dispatch('setUserPrefs', response);
            resolve(response);
          })
          .catch(error => {
            console.error('An error occurred logging in', error);
            dispatch('app/sendToastMessage', { text: `Something's gone wrong logging in, please try again later.`, type: 'error' }, { root: true });
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
            commit('SET_CURRENT_USER', null);
            dispatch('app/initialize', null, { root: true });
            resolve(response);
          })
          .catch(error => {
            console.error('Could not log user out', error);
            commit('SET_CURRENT_USER', null); // force logout
            dispatch('app/initialize', null, { root: true }); // force app cleanup
            reject(error);
          });
      });
    },

    attemptPasswordRecovery({ state, commit }, token) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.recover(token)
          .then(response => {
            commit('SET_CURRENT_USER', response);
            resolve(response);
          })
          .catch(error => {
            console.error('Failed to verify recover token: %o', error);
            reject(error);
          });
      });
    },

    attemptSignup({ getters, state }, credentials) {
      const userOptions = getters['userOptions'];
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.signup(credentials.email, credentials.password, {
          // set defaults
          user_explore: userOptions.showExploreLinks,
          user_imdb: userOptions.showIMDbLinks,
          user_sort: userOptions.sortPreset,
          user_start: userOptions.startPage
        })
          .then(response => {
            resolve(response); // Confirmation email sent
          })
          .catch(error => {
            console.error('An error occurred trying to sign up', error);
            reject(error);
          });
      });
    },

    initAuth({ commit, rootGetters }) {
      const APIUrl = `https://${rootGetters['app/siteURL']}/.netlify/identity`;

      const initNewGoTrue = APIUrl => {
        return new GoTrue({
          APIUrl: APIUrl,
          setCookie: true
        });
      };

      commit('SET_GOTRUE', initNewGoTrue(APIUrl));
    },

    processInvite({ state }, data) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.acceptInvite(data.token, data.pwd)
          .then(response => {
            resolve(response); // invite successfull, user created
          })
          .catch(error => {
            console.error('An error occurred trying to process the invite', error);
            reject(error);
          });
      });
    },

    refreshUserToken({ state }) {
      const user = state.GoTrueAuth.currentUser();
      if (user) {
        return user.jwt()
      } else {
        // if we can't get a new token, then something must have corrupted the GoTrue instance
        // forcing a logout and app initialization to get back to a working state
        commit('SET_CURRENT_USER', null);
        dispatch('app/initialize', null, { root: true });
        dispatch('app/sendToastMessage', { text: `Session error. Please log in again`, type: 'error' }, { root: true });
      }
    },

    requestPasswordRecovery({ dispatch, state }, email) {
      state.GoTrueAuth.requestPasswordRecoveryy(email)
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

      const metaLength = Object.keys(userMeta).length;

      if (metaLength > 0) {
        // user preferences are complete and available in the User object GoTrue returned
        commit('SET_EXPLORE_LINKS', userMeta.user_explore);
        commit('SET_IMDB_LINKS', userMeta.user_imdb);
        commit('SET_SORT_PRESET', userMeta.user_sort);
        commit('SET_START_PAGE', userMeta.user_start);
      } else {
        // user has no (or insufficient) preferences
        let userUpdate = {
          email: user.email,
          data: {
            user_explore: userOptions.showExploreLinks,
            user_imdb: userOptions.showIMDbLinks,
            user_sort: userOptions.sortPreset,
            user_start: userOptions.startPage
          }
        };
        dispatch('updateUserAccount', userUpdate);
      }
    },
  }
};