import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ConsultantManagementComponent } from './consultant-management/consultant-management.component';
import {MatDividerModule} from '@angular/material/divider';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { SubCategoryManagementComponent } from './sub-category-management/sub-category-management.component';
import { SubCategoryMgtComponent } from './sub-category-mgt/sub-category-mgt.component';
import { SubscriptionMgtComponent } from './subscription-mgt/subscription-mgt.component';
import { BannerManagementComponent } from './banner-management/banner-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubAdminComponent } from './sub-admin/sub-admin.component';
import { AddAdminComponent } from './sub-admin/add-admin/add-admin.component';
import { PaymentMgmtComponent } from './payment-mgmt/payment-mgmt.component';
import { PurchasedPlanComponent } from './user-management/purchased-plan/purchased-plan.component';
import { ConsulationDoneComponent } from './consulation-done/consulation-done.component';
import { CmsManagementComponent } from './cms-management/cms-management.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EdiorDialogComponent } from './edior-dialog/edior-dialog.component';
import { ReportManagementComponent } from './report-management/report-management.component';
import { NotificationManagementComponent } from './notification-management/notification-management.component';
import { SendNotificationComponent } from './notification-management/send-notification/send-notification.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { QuestionsAnsDialogComponent } from './questions-ans-dialog/questions-ans-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CommisionPercentageManagementComponent } from './commision-percentage-management/commision-percentage-management.component';
import { AddCommisionComponent } from './commision-percentage-management/add-commision/add-commision.component';


@NgModule({
  declarations: [
  
    LayoutComponent,
       DashboardComponent,
       UserManagementComponent,
       ConsultantManagementComponent,
       CategoryManagementComponent,
       SubCategoryManagementComponent,
       SubCategoryMgtComponent,
       SubscriptionMgtComponent,
       BannerManagementComponent,
       SubAdminComponent,
       AddAdminComponent,
       PaymentMgmtComponent,
       PurchasedPlanComponent,
       ConsulationDoneComponent,
       CmsManagementComponent,
       EdiorDialogComponent,
       ReportManagementComponent,
       NotificationManagementComponent,
       SendNotificationComponent,
       QuestionsAnsDialogComponent,
       ChangePasswordComponent,
       CommisionPercentageManagementComponent,
       AddCommisionComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    CKEditorModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class LayoutModule { }
