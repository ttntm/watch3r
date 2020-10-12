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
    /**
     * Authorise and login users via email
     * @param {*} store - vuex store object
     * @param {object} credentials - object containing email and password
     * @property {string} credentials.email - email of the user eg hello@email.com
     * @property {string} credentials.password - password string
     */
    attemptLogin({ commit, state }, credentials) {
      //console.log(`Attempting login for ${credentials.email}`);
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.login(credentials.email, credentials.password, true)
          .then(response => {
            resolve(response);
            commit("SET_CURRENT_USER", response);
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
            console.error("An error occurred trying to sig nup", error);
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
    attemptLogout({ state, commit }) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.currentUser()
          .logout()
          .then(resp => {
            //console.log("User logged out", resp);
            commit("SET_CURRENT_USER", null);
            resolve(resp);
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
      console.log("Attempting to verify invite", data.token);
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
    initAuth({ commit, rootGetters }) {
      // https://stackoverflow.com/questions/5284147/validating-ipv4-addresses-with-regexp/57421931#57421931
      const IPv4Pattern = /\b((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\b/;
      const hostName = document.location.hostname;
      const APIUrl = `https://${hostName}/.netlify/identity`;
      const initNewGoTrue = APIUrl => {
        return new GoTrue({
          APIUrl: APIUrl,
          audience: "",
          setCookie: true
        });
      };

      // Detect if app is being run in a development environment, if so a flag is set to indicate this so that it is
      // possible to set the URL for the netlify identity in the login component.
      // TODO : Move this logic into a separate action.
      if (hostName.match(IPv4Pattern) || hostName === "localhost") {
        //console.log("Looks like your in a dev environment", hostName);
        commit("app/SET_DEV_ENV", true, { root: true });

        commit(
          "SET_GOTRUE",
          initNewGoTrue(
            `https://${rootGetters["app/siteURL"]}/.netlify/identity`
          )
        );

        this.subscribe(mutation => {
          if (mutation.type === "app/SET_SITE_URL") {
            console.log(
              "Re-initialising Go True client with",
              rootGetters["app/siteURL"]
            );
            commit(
              "SET_GOTRUE",
              initNewGoTrue(
                `https://${rootGetters["app/siteURL"]}/.netlify/identity`
              )
            );
          }
        });

        return;
      }

      //console.log("Initialising Go True client with ", APIUrl);
      commit("SET_GOTRUE", initNewGoTrue(APIUrl));
    },

    requestPasswordRecover({ dispatch, state }, email) {
      let msg = { text: '', type: ''};
      state.GoTrueAuth.requestPasswordRecovery(email)
        .then(response => {
          msg.text = `Recovery email sent.`;
          msg.type =  'success';
          dispatch('app/sendToastMessage', msg, { root: true });
          resolve(response);
        })
        .catch(error => {
          console.error(`Error sending recovery email`, error);
          msg.text = `Error sending recovery email, please try again later.`;
          msg.type =  'error';
          dispatch('app/sendToastMessage', msg, { root: true });
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
      let msg = { text: '', type: ''};
      return new Promise((resolve, reject) => {
        const user = state.GoTrueAuth.currentUser();
        user
          .update(userData)
          .then(response => {
            // console.log("Updated user account details", response);
            msg.text = `Profile successfully updated.`;
            msg.type =  'success';
            dispatch('setUserPrefs');
            dispatch('app/sendToastMessage', msg, { root: true });
            resolve(response);
          })
          .catch(error => {
            // console.error("Failed to update user account: %o", error);
            console.error(`Error updating the user profile`, error);
            msg.text = `Error updating the user profile, please try again later.`;
            msg.type =  'error';
            dispatch('app/sendToastMessage', msg, { root: true });
            reject(error);
          });
      });
    },

    setUserPrefs({ commit, getters }) {
      // set user preferences with login
      const user = getters['currentUser'];
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