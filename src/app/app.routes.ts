import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'category/:slug',
    loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'order-confirmation/:orderNumber',
    loadComponent: () => import('./pages/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent)
  },
  {
    path: 'debug',
    loadComponent: () => import('./components/debug/debug.component').then(m => m.DebugComponent)
  },
  {
    path: 'test',
    loadComponent: () => import('./simple-test.component').then(m => m.SimpleTestComponent)
  },
  {
    path: '**',
    redirectTo: '/products'
  }
];
