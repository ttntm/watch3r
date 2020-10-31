import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const About = () => import(/* webpackChunkName: "About" */ '@/views/About.vue');
const Home = () => import(/* webpackChunkName: "Home" */ '@/views/Home.vue');
const Invite = () => import(/* webpackChunkName: "Invite" */ '@/views/Invite.vue');
const List = () => import(/* webpackChunkName: "List" */ '@/views/List.vue');
const Profile = () => import(/* webpackChunkName: "Profile" */ '@/views/Profile.vue');
const Recover = () => import(/* webpackChunkName: "Recover" */ '@/views/Recover.vue');
const Support = () => import(/* webpackChunkName: "Support" */ '@/views/Support.vue');
const Signup = () => import(/* webpackChunkName: "Signup" */ '@/views/Signup.vue');

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
      beforeEnter: (to, from, next) => {
        if(store.getters['user/loggedIn']) {
          // only users that aren't logged in can go to recover
          router.push({ name: 'home' });
        } else {
          return next();
        }
      },
    },
    {
      path: '/support',
      name: 'support',
      component: Support
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      beforeEnter: (to, from, next) => {
        if(store.getters['user/loggedIn']) {
          // only users that aren't logged in can go to signup
          router.push({ name: 'home' });
        } else {
          return next();
        }
      },
    },
    {
      path: '/track',
      name: 'tracker',
      component: List,
      meta: {
        authRequired: true,
        mode: 'tracklist',
        subtitle: 'Track watched titles, rate them and write down some notes.'
      },
    },
    {
      path: '/watch',
      name: 'watchlist',
      component: List,
      meta: {
        authRequired: true,
        mode: 'watchlist',
        subtitle: "Add titles to your watchlist so you don't lose track of things."
      },
    },
    {
      path: '/:pathMatch(.*)',
      name: '404',
      //component: FourOFour,
      beforeEnter: () => {
        return router.push({ name: 'home' }); //redirect invalid calls home for now
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
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