/**
 * This module is responsible for all state and actions related to the current authenticated user.
 */
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
    SET_GOTRUE(state, value) {
      state.GoTrueAuth = value;
    },
    SET_CURRENT_USER(state, value) {
      state.currentUser = value;
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

    /**
     * Authorise and login users via email
     * @param {*} store - vuex store object
     * @param {object} credentials - object containing email and password
     * @property {string} credentials.email - email of the user eg hello@email.com
     * @property {string} credentials.password - password string
     */
    attemptLogin({ commit, dispatch, state }, credentials) {
      //console.log(`Attempting login for ${credentials.email}`);
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.login(credentials.email, credentials.password, true)
          .then(response => {
            commit("SET_CURRENT_USER", response);
            dispatch('setUserPrefs', response);
            resolve(response);
          })
          .catch(error => {
            console.error("An error occurred logging in", error);
            reject(error);
          });
      });
    },

    /**
     *
     * @param {*} store - vuex store object
     * @param {object} credentials - object containing email and password
     * @property {string} credentials.email - email of the user eg hello@email.com
     * @property {string} credentials.password - password string
     */
    attemptSignup({ getters, state }, credentials) {
      //console.log(`Attempting signup for ${credentials.email}...`, credentials);
      const userOptions = getters['userOptions'];
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.signup(credentials.email, credentials.password, {
          // set defaults
          user_imdb: userOptions.showIMDbLinks,
          user_sort: userOptions.userSort,
          user_start: userOptions.userStart
        })
          .then(response => {
            //console.log(`Confirmation email sent`, response);
            resolve(response);
          })
          .catch(error => {
            console.error("An error occurred trying to sign up", error);
            reject(error);
          });
      });
    },

    /**
     * This confirms a new user from an email signup by parsing the token which has been extracted from the Netlify
     * confirmation email.
     * @param {*} store - vuex store object
     * @param {string} token - token from confirmation email eg. "BFX7olHxIwThlfjLGGfaCA"
     */
    attemptConfirmation({ state }, token) {
      //console.log("Attempting to verify token", token);
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.confirm(token)
          .then(response => {
            //console.log("User has been confirmed");
            resolve(response);
          })
          .catch(error => {
            console.error("An error occurred trying to confirm the user", error);
            reject(error);
          });
      });
    },

    /**
     * Sign out the current user if they are logged in.
     * TODO: Promisify this, and remove alert out. follow up UI changes should be handled outside of vuex
     * @param {*} store - vuex store object
     */
    attemptLogout({ commit, getters, state }) {
      return new Promise((resolve, reject) => {
        const user = state.GoTrueAuth.currentUser();
        user
          .logout()
          .then(response => {
            //console.log("User logged out", response);
            commit("SET_CURRENT_USER", null);
            resolve(response);
          })
          .catch(error => {
            console.error("Could not log user out", error);
            commit("SET_CURRENT_USER", null);
            reject(error);
          });
      });
    },
    /**
     * This accepts an invite and creates a new user by parsing the token which has been extracted from the Netlify
     * invite email.
     * @param {*} store - vuex store object
     * @param {string} token - token from invite email eg. "BFX7olHxIwThlfjLGGfaCA"
     */
    processInvite({ state }, data) {
      // console.log("Attempting to verify invite", data.token);
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.acceptInvite(data.token, data.pwd)
          .then(response => {
            // console.log("Invite was successful, user created");
            resolve(response);
          })
          .catch(error => {
            console.error("An error occurred trying to process the invite", error);
            reject(error);
          });
      });
    },

    /**
     * Initialises a GoTrue instance. This method also checks if user is in a local environment  based on the URL.
     * this updates the `app/SET_DEV_ENV` flag. This facilitates a zero-config setup as a developer can input their
     * netlify URL in the UI (see the the `SetNetlifyURL.vue` component). Inspired from the official Netlify
     * Identity widget.
     * @param {*} store - vuex store object
     */
    initAuth({ commit, getters, rootGetters }) {
      const APIUrl = `https://${rootGetters["app/siteURL"]}/.netlify/identity`;

      const initNewGoTrue = APIUrl => {
        return new GoTrue({
          APIUrl: APIUrl,
          setCookie: true
        });
      };

      // console.log("Initialising Go True client with ", APIUrl);
      commit("SET_GOTRUE", initNewGoTrue(APIUrl));
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

    attemptPasswordRecovery({ state, commit }, token) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.recover(token)
          .then(response => {
            console.log("Signing in user with recovery token");
            commit("SET_CURRENT_USER", response);
            resolve(response);
          })
          .catch(error => {
            // console.error("Failed to verify recover token: %o", error);
            reject();
          });
      });
    },

    updateUserAccount({ dispatch, state }, userData) {
      return new Promise((resolve, reject) => {
        const user = state.GoTrueAuth.currentUser();
        user
          .update(userData)
          .then(response => {
            // console.log("Updated user account details", response);
            dispatch('setUserPrefs', response);
            dispatch('app/sendToastMessage', { text: `Profile successfully updated.`, type: 'success' }, { root: true });
            resolve(response);
          })
          .catch(error => {
            // console.error("Failed to update user account: %o", error);
            console.error(`Error updating the user profile`, error);
            dispatch('app/sendToastMessage', { text: `Error updating the user profile, please try again later.`, type: 'error' }, { root: true });
            reject(error);
          });
      });
    },

    setUserPrefs({ commit, dispatch, getters }, data) {
      // set user preferences with login
      const user = data;
      const userMeta = user.user_metadata;
      const userOptions = getters['userOptions'];

      if (!Object.keys(userMeta).length > 0) {
        // user has no preferences -- console.log('setting DEFAULT prefs...');
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
        // user preferences are available -- console.log('setting USER prefs...');
        commit('SET_IMDB_LINKS', userMeta.user_imdb);
        commit('SET_SORT_PRESET', userMeta.user_sort);
        commit('SET_START_PAGE', userMeta.user_start);
      }
    },
  }
};