import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLogin from '../components/UserLogin.vue'
import UserRegister from '../components/UserRegister.vue'
import CropsView from '../views/CropsView.vue'
import CropDetailView from '../views/CropDetailView.vue'
import CropForm from '../views/CropForm.vue'
import ReportarPlagas from '../views/ReportarPlagas.vue';
import ForumView from '../views/ForumView.vue'
import ProfileView from "@/views/ProfileView.vue";
import CalendarView from '../views/CalendarView.vue'

    
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: UserLogin
    },
    {
      path: '/register',
      name: 'register',
      component: UserRegister,
    },
    {
      path: '/crops',
      name: 'crops',
      component: CropsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/crops/new',
      name: 'new-crop',
      component: CropForm,
      meta: { requiresAuth: true }
    },
    
    {
      path: '/crops/:id',
      name: 'crop-detail',
      component: CropDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/crops/:id/edit',
      name: 'edit-crop',
      component: CropForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/reportar-plagas',
      name: 'reportar-plagas',
      component: ReportarPlagas,
      meta: { requiresAuth: true } // Si es necesario que solo usuarios autenticados puedan acceder
    },
    {
      path: '/foro',
      name: 'Foro',
      component: ForumView,
      meta: { requiresAuth: true } // Si solo los usuarios autenticados pueden acceder
    },

    {
      path: '/profile/:id', 
      name: 'Profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    
    {
      path: '/calendario-riego',
      name: 'Calendario-riego',
      component: CalendarView,
      meta: { requiresAuth: true } 
   },
   {
    path: '/ver-plagas',
    name: 'VerPlagas',
    component: () => import('../views/VerPlagas.vue'),
    meta: { requiresAuth: true }
 }, 

 {
  path: '/marketplace',
  name: 'Marketplace',
  component: () => import('@/views/MarkeplaceView.vue'),
  meta: { requiresAuth: true }
}


 
  ]
})

// Protección de rutas
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem('token')) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
