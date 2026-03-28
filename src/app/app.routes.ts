import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routing').then(m => m.AuthRoutingModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/pages.routing').then(m => m.PagesRoutingModule)
  },
  { path: '**', redirectTo: '/auth/login' }
];

export { routes };

