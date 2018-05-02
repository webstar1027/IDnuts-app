import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceInfoPage } from './service-info';

@NgModule({
  declarations: [
    ServiceInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceInfoPage),
  ],
})
export class ServiceInfoPageModule {}
