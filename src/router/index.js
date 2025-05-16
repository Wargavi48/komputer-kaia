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
      path: '/applet/photo-album/:photo?',
      name: 'Photo Album',
      component: () => import('../views/applet/PhotoAlbum/Index.vue'),
    },
    {
      path: '/applet/video-call',
      name: 'Video Call',
      component: () => import('../views/applet/VideoCall.vue'),
    },
    {
      path: '/applet/media-player',
      name: 'Media Player',
      component: () => import('../views/applet/MediaPlayer/Index.vue'),
    },
    {
      path: '/applet/voice-mail',
      name: 'Voice Mail',
      component: () => import('../views/applet/VoiceMail/Index.vue'),
    },
  ],
})

export default router
