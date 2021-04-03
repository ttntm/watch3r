import { createRouter, createWebHistory } from 'vue-router';
import store from './store/index.js';

const About = () => import('./views/About.vue');
// const Admin = () => import('./views/Admin.vue');
const Explore = () => import('./views/Explore.vue');
const Home = () => import('./views/Home.vue');
const Import = () => import('./views/Import.vue');
const Invite = () => import('./views/Invite.vue');
const List = () => import('./views/List.vue');
const Profile = () => import('./views/Profile.vue');
const Recover = () => import('./views/Recover.vue');
const Support = () => import('./views/Support.vue');
const Signup = () => import('./views/Signup.vue');

function forbidden(to, from, next) {
  if(store.getters['user/loggedIn']) {
    router.push({ name: 'home' }); // prevent logged in users from going where they shouldn't
  } else {
    return next();
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    // {
    //   path: '/admin',
    //   name: 'admin',
    //   component: Admin
    // },
    {
      path: '/explore',
      name: 'explore',
      component: Explore,
      meta: {
        authRequired: true,
      },
      beforeEnter: (to, from, next) => {
        const recSource = store.getters['explore/recSource'];
        const tl = store.getters['list/tracklist'];

        if (to.query.title && tl.length > 0) {
          const current = tl.filter(item => item.id === to.query.title);

          if (current.length > 0 && current[0] !== recSource) {
            const req = {
              id: current[0].id,
              type: current[0].type
            };

            store.dispatch('explore/clearRecommendations'); // so we get back the 'loading' state
            store.dispatch('explore/updateRecSource', current[0]);
            store.dispatch('explore/getRecommendations', req);
          }
        } else if (tl.length === 0) {
          store.dispatch('list/readList', 'tracklist');
        }

        return next(); // will simply show blank 'explore' route with ability to refresh ('explore' loads tracklist if empty...)
      }
    },
    {
      path: '/import',
      name: 'import',
      component: Import,
      meta: {
        authRequired: true,
      },
      beforeEnter: (to, from, next) => {
        const tl = store.getters['list/tracklist'];
        const wl = store.getters['list/watchlist'];

        if (tl.length === 0) {
          store.dispatch('list/readList', 'tracklist');
        }

        if (wl.length === 0) {
          store.dispatch('list/readList', 'watchlist');
        }

        return next();
      }
    },
    {
      path: '/invite',
      name: 'invite',
      component: Invite
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        authRequired: true,
      }
    },
    {
      path: '/recover',
      name: 'recover',
      component: Recover,
      beforeEnter: [forbidden]
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      beforeEnter: [forbidden]
    },
    {
      path: '/support',
      name: 'support',
      component: Support
    },
    {
      path: '/track',
      name: 'tracker',
      component: List,
      meta: {
        authRequired: true,
        mode: 'tracklist',
        subtitle: 'Track watched titles, rate them and write down some notes.'
      }
    },
    {
      path: '/watch',
      name: 'watchlist',
      component: List,
      meta: {
        authRequired: true,
        mode: 'watchlist',
        subtitle: "Add titles to your watchlist so you don't lose track of things."
      }
    },
    {
      path: '/:pathMatch(.*)',
      name: '404',
      beforeEnter: () => {
        return router.push({ name: 'home' }); //redirect invalid calls home for now
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 } // always scroll to top
  }
});

router.beforeEach((to, from, next) => {
  store.dispatch('app/closeAllModals'); // close all open windows if there are any

  if (store.getters['tools/searchActive']) {  // reset search when navigation occurs
    store.dispatch('tools/resetList');
  }

  if (!to.meta.authRequired) {
    return next();
  }

  if (to.meta.authRequired && store.getters['user/loggedIn']) {
    return next();
  } else {
    router.push({ name: 'home' });
  }
});

export default router;