import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'signup',
        loadComponent: () => import('./features/signup/signup').then((m) => m.Signup),
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login').then((m) => m.Login),
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
    },
    {
        path: 'add-product',
        loadComponent: () => import('./features/add-product/add-product').then((m) => m.AddProduct),
    },
    {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
    },

];
