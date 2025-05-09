import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ComputerDesktopView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/applet/photo-viewer',
      name: 'Photo viewer',
      component: () => import('../views/applet/PhotoViewer.vue'),
    },
    {
      path: '/applet/email',
      name: 'Email Client',
      component: () => import('../views/applet/EmailApp.vue'),
    },
    {
      path: '/applet/photo-album',
      name: 'Photo Album',
      component: () => import('../views/applet/PhotoAlbum.vue'),
    },
  ],
})

export default router
