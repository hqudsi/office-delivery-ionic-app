import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataResolverService } from '../services/resolver/data-resolver.service';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'orders/:id',
        resolve: {
          data: DataResolverService
        },
        loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule)
      },
      {
        path: 'customers',
        loadChildren: () => import('./customers/customers.module').then( m => m.CustomersPageModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
      },
      {
        path: 'customer-payments',
        loadChildren: () => import('./customer-payments/customer-payments.module').then( m => m.CustomerPaymentsPageModule)
      },
      {
        path: 'drivers',
        loadChildren: () => import('./drivers/drivers.module').then( m => m.DriversPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'finance',
        loadChildren: () => import('./finance/finance.module').then( m => m.FinancePageModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
      },
      {
        path: 'orders-statistics',
        loadChildren: () => import('./orders-statistics/orders-statistics.module').then( m => m.OrdersStatisticsPageModule)
      },
      {
        path: 'customers-finance',
        loadChildren: () => import('./customers-finance/customers-finance.module').then( m => m.CustomersFinancePageModule)
      },
      {
        path: 'drivers-collection',
        loadChildren: () => import('./drivers-collection/drivers-collection.module').then( m => m.DriversCollectionPageModule)
      },
      {
        path: 'finance-changes',
        loadChildren: () => import('./finance-changes/finance-changes.module').then( m => m.FinanceChangesPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'add-order',
    loadChildren: () => import('./adding-pages/add-order/add-order.module').then( m => m.AddOrderPageModule)
  },
  {
    path: 'add-customer',
    loadChildren: () => import('./adding-pages/add-customer/add-customer.module').then( m => m.AddCustomerPageModule)
  },
  {
    path: 'add-driver',
    loadChildren: () => import('./adding-pages/add-driver/add-driver.module').then( m => m.AddDriverPageModule)
  },
  {
    path: 'add-payment',
    loadChildren: () => import('./adding-pages/add-payment/add-payment.module').then( m => m.AddPaymentPageModule)
  },
  {
    path: 'details/order/:id',
    resolve: {
      data: DataResolverService
    },
    loadChildren: () => import('./details/order/order.module').then( m => m.OrderPageModule)
  },
  {
    path: 'details/user/:id',
    resolve: {
      data: DataResolverService
    },
    loadChildren: () => import('./details/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'details/account-statement/:id',
    resolve: {
      data: DataResolverService
    },
    loadChildren: () => import('./details/account-statement/account-statement.module').then( m => m.AccountStatementPageModule)
  },
  {
    path: 'details/driver-collection/:id',
    resolve: {
      data: DataResolverService
    },
    loadChildren: () => import('./details/driver-collection/driver-collection.module').then( m => m.DriverCollectionPageModule)
  },
  {
    path: 'details/customer-payment/:id',
    resolve: {
      data: DataResolverService
    },
    loadChildren: () => import('./details/customer-payment/customer-payment.module').then( m => m.CustomerPaymentPageModule)
  },
  {
    path: 'details/driver-collection-voucher/:id',
    resolve: {
      data: DataResolverService
    },
    loadChildren: () => import('./details/driver-collection-voucher/driver-collection-voucher.module').then( m => m.DriverCollectionVoucherPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
