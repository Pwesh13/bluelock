import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { JoueurDetailComponent } from './joueur-detail/joueur-detail.component';
import { StatsComponent } from './stats/stats.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { adminGuard, authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'joueurs/:id', component: JoueurDetailComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent), canActivate: [adminGuard] },
  { path: 'admin/ajouter', loadComponent: () => import('./admin/admin-form/admin-form.component').then(m => m.AdminFormComponent), canActivate: [adminGuard] },
  { path: 'admin/joueur/:id', loadComponent: () => import('./admin/admin-form/admin-form.component').then(m => m.AdminFormComponent), canActivate: [adminGuard] },
  { path: 'mon-profil', loadComponent: () => import('./mon-profil/mon-profil.component').then(m => m.MonProfilComponent), canActivate: [authGuard] },
];