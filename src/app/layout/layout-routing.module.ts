import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerManagementComponent } from './banner-management/banner-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { CmsManagementComponent } from './cms-management/cms-management.component';
import { ConsulationDoneComponent } from './consulation-done/consulation-done.component';
import { ConsultantManagementComponent } from './consultant-management/consultant-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { NotificationManagementComponent } from './notification-management/notification-management.component';
import { SendNotificationComponent } from './notification-management/send-notification/send-notification.component';
import { PaymentMgmtComponent } from './payment-mgmt/payment-mgmt.component';
import { ReportManagementComponent } from './report-management/report-management.component';
import { AddAdminComponent } from './sub-admin/add-admin/add-admin.component';
import { SubAdminComponent } from './sub-admin/sub-admin.component';
import { SubCategoryManagementComponent } from './sub-category-management/sub-category-management.component';
import { SubCategoryMgtComponent } from './sub-category-mgt/sub-category-mgt.component';
import { SubscriptionMgtComponent } from './subscription-mgt/subscription-mgt.component';
import { PurchasedPlanComponent } from './user-management/purchased-plan/purchased-plan.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CommisionPercentageManagementComponent } from './commision-percentage-management/commision-percentage-management.component';

const routes: Routes = [
  {path:'',component:LayoutComponent,children:[
    {path:'',redirectTo:'dashboard',pathMatch:'full'},
    {path:'dashboard',component:DashboardComponent},
    {path:'user-mgmt',component:UserManagementComponent},
    {path:'consultant-mgmt',component:ConsultantManagementComponent},
    {path:'category-mgmt',component:CategoryManagementComponent},
    {path:'sub-category-mgmt/:id',component:SubCategoryManagementComponent},
    {path:'sub-category-mgt/:id', component:SubCategoryMgtComponent},
    {path:'subscription-mgt', component:SubscriptionMgtComponent},
    {path:'banner-management', component:BannerManagementComponent},
    {path:'sub-admin', component:SubAdminComponent},
    {path:'add-admin', component:AddAdminComponent},
    {path:'payment-management', component:PaymentMgmtComponent},
    {path:'user-mgmt/purchased-plan', component:PurchasedPlanComponent},
    {path:'consulation-done', component:ConsulationDoneComponent},
    {path:'cms-management', component:CmsManagementComponent},
    {path:'report-management', component:ReportManagementComponent},
    {path:'notification-management', component:NotificationManagementComponent},
    {path:'send-notification', component:SendNotificationComponent},
    {path:'commision-management', component:CommisionPercentageManagementComponent},





  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
