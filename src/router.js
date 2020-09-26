import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const Home = () => import(/* webpackChunkName: "Home" */ '@/views/Home.vue');
const Details = () => import(/* webpackChunkName: "Details" */ '@/views/TitleDetails.vue');
const Watchlist = () => import(/* webpackChunkName: "Watchlist" */ '@/views/Watchlist.vue');
const Tracklist = () => import(/* webpackChunkName: "Tracklist" */ '@/views/Tracklist.vue');
const About = () => import(/* webpackChunkName: "About" */ '@/views/About.vue');
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
      path: '/title/:id',
      name: 'details',
      component: Details,
      meta: { authRequired: true }
    },
    {
      path: '/track',
      name: 'tracker',
      component: Tracklist,
      meta: { authRequired: true }
    },
    {
      path: '/watch',
      name: 'watchlist',
      component: Watchlist,
      meta: { authRequired: true },
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
      path: '/*',
      name: '404',
      //component: FourOFour,
      beforeEnter: () => {
        return router.push({ name: 'home' }); //redirect invalid calls home for now
      }
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
});

router.beforeEach((to, from, next) => {
  if(store.getters['app/menuOpen']) {
    store.dispatch('app/toggleMenu', false);
  }
  // If the route doesnt have a `meta.authRequired` property go on ahead!
  if(!to.meta.authRequired) {
    return next();
  }
  // If we go this far then it must have the `meta.authRequired`. But is there is a user logged in? If so, then go right on ahead!
  if(to.meta.authRequired && store.getters["user/loggedIn"]) {
    return next();
  }
});

export default router;