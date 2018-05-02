import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatingInfoPage } from './dating-info';

@NgModule({
  declarations: [
    DatingInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(DatingInfoPage),
  ],
})
export class DatingInfoPageModule {}
