import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { FranchiseManagementComponent } from './franchise-management/franchise-management.component';
import { SalonManagementComponent } from './salon-management/salon-management.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent, // The dashboard component includes the sidebar and a <router-outlet>
    children: [
      { path: '', redirectTo: 'statistics', pathMatch: 'full' },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'franchise', component: FranchiseManagementComponent },
      { path: 'salon-management', component: SalonManagementComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
