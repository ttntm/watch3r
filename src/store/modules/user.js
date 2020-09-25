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
      GoTrueAuth: null
    };
  },
  getters: {
    loggedIn: state => !!state.currentUser,

    currentUser: state => state.currentUser,

    netlifyUserLoggedIn: state => !!state.GoTrueAuth.currentUser(),

    currentNetlifyUser: state => state.GoTrueAuth.currentUser(),

    GoTrueAuth: state => state.GoTrueAuth
  },
  mutations: {
    SET_GOTRUE(state, value) {
      state.GoTrueAuth = value;
    },

    SET_CURRENT_USER(state, value) {
      state.currentUser = value;
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
            console.log("An error occurred signing up", error);
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
    attemptSignup({ state }, credentials) {
      //console.log(`Attempting signup for ${credentials.email}...`, credentials);
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.signup(credentials.email, credentials.password, {
          full_name: credentials.name
        })
          .then(response => {
            //console.log(`Confirmation email sent`, response);
            resolve(response);
          })
          .catch(error => {
            console.log("An error occurred trying to signup", error);
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
            console.log("An error occurred trying to confirm the user", error);
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
            console.log("Invite was successful, user created");
            resolve(response);
          })
          .catch(error => {
            console.log("An error occurred trying to process the invite", error);
            reject(error);
          });
      });
    },

    /**
     *not required, delete at some point
     * @param {*} store - vuex store object
     */
    getUserJWTToken({ getters, state }) {
      console.log(getters.currentNetlifyUser);
      if (!getters.currentNetlifyUser) {
        alert("Please sign in again");
        console.warn("User needs to sign in again");
        return;
      }
      state.GoTrueAuth.currentUser()
        .jwt()
        .then(token => {
          alert("got user token: ", token);
        });
    },

    /**
     * This should be deleted at some point
     */
    getCurrentUser({ state }) {
      console.log("User Object", state.GoTrueAuth.currentUser());
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

        // console.log(
        //   "Initialising Go True client with",
        //   `https://${rootGetters["app/siteURL"]}/.netlify/identity`
        // );
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

    requestPasswordRecover({ state }, email) {
      state.GoTrueAuth.requestPasswordRecovery(email)
        .then(response => alert("Recovery email sent", { response }))
        .catch(error => alert("Error sending recovery mail:", error));
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
            console.error("Failed to verify recover token: %o", error);
            reject();
          });
      });
    },
  }
};