import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/chapter/c2-2',
      component: () =>
        import(/* webpackChunkName: "chapter-2" */ './views/chapters/c2-2.vue')
    },
    {
      path: '/chapter/c2-1',
      component: () =>
        import(/* webpackChunkName: "chapter-2" */ './views/chapters/c2-1.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
});
