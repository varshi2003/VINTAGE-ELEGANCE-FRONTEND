import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminSignupComponent } from './admin-sign-up/admin-sign-up.component';
import { ModeratorSignupComponent } from './moderator-sign-up/moderator-sign-up.component';

import { AdminGuard } from './guards/admin-guard.guard';
import { ModeratorGuard } from './guards/moderator-guard.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/signup', component: AdminSignupComponent, canActivate: [AdminGuard] },
  { path: 'moderator/signup', component: ModeratorSignupComponent, canActivate: [ModeratorGuard] },
  { path: 'haircare', loadComponent: () => import('./pages/haircare/haircare.component').then(m => m.HaircareComponent) },
  { path: 'skincare', loadComponent: () => import('./pages/skincare/skincare.component').then(m => m.SkincareComponent) },
  { path: 'bodycare', loadComponent: () => import('./pages/bodycare/bodycare.component').then(m => m.BodycareComponent) },
  { path: 'salon-locator', loadComponent: () => import('./pages/salon-locator/salon-locator.component').then(m => m.SalonLocatorComponent) },
  { path: 'pricing', loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent) },
  { path: 'contact-us', loadComponent: () => import('./pages/contact-us/contact-us.component').then(m => m.ContactUsComponent) },
  { path: 'franchise', loadComponent: () => import('./pages/franchise/franchise.component').then(m => m.FranchiseComponent) },
  { path: 'bridal', loadComponent: () => import('./pages/bridal/bridal.component').then(m => m.BridalComponent) }
];
