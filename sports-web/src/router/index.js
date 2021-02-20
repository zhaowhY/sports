import Vue from 'vue';
import Router from 'vue-router';

// router lazy load
Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Index.vue'),
      children: [
        {
          path: '/project',
          name: 'project',
          component: () => import('../views/Project.vue')
        },
        {
          path: '/competition',
          name: 'competition',
          component: () => import('../views/Competition.vue')
        },
        {
          path: '/player',
          name: 'player',
          component: () => import('../views/Player.vue')
        },
        {
          path: '/admin',
          name: 'admin',
          component: () => import('../views/Admin.vue')
        },
        {
          path: '/plog',
          name: 'plog',
          component: () => import('../views/Plog.vue')
        }
      ]
    }
  ]
});
