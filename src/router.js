import { createRouter, createWebHashHistory } from 'vue-router';
import store from './store';

const Home = () => import(/* webpackChunkName: "Home" */ '@/components/HelloWorld.vue');
const Details = () => import(/* webpackChunkName: "Details" */ '@/views/TitleDetails.vue');
const Watchlist = () => import(/* webpackChunkName: "Watchlist" */ '@/views/Watchlist.vue');
const Tracklist = () => import(/* webpackChunkName: "Tracklist" */ '@/views/Tracklist.vue');

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/title/:id',
      name: 'details',
      component: Details,
      // beforeEnter: (to, from, next) => {
      //    if(!store.state.user.currentUser) { //get stored user state from vuex store
      //     router.push({ name: 'home' });
      //   } else {
      //     return next();
      //   }
      // }
    },
    {
      path: '/track',
      name: 'tracker',
      component: Tracklist,
      // beforeEnter: (to, from, next) => {
      //    if(!store.state.user.currentUser) { //get stored user state from vuex store
      //     router.push({ name: 'home' });
      //   } else {
      //     return next();
      //   }
      // }
    },
    {
      path: '/watch',
      name: 'watchlist',
      component: Watchlist,
      // beforeEnter: (to, from, next) => {
      //    if(!store.state.user.currentUser) { //get stored user state from vuex store
      //     router.push({ name: 'home' });
      //   } else {
      //     return next();
      //   }
      // }
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
});