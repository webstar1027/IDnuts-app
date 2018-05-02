import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoleOptionsPage } from './role-options';

@NgModule({
  declarations: [
    RoleOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(RoleOptionsPage),
  ],
})
export class RoleOptionsPageModule {}
