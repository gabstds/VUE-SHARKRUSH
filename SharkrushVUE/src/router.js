import { createRouter, createWebHistory } from 'vue-router';
import CalcIMC from './components/CalcIMC.vue';
import CalcKalorias from './components/CalcKalorias.vue';

const routes = [
  { path: '/', redirect: '/calimc' },
  { path: '/calimc', component: CalcIMC },
  { path: '/calckalorias', component: CalcKalorias },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
