import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatingsPage } from './datings';

@NgModule({
  declarations: [
    DatingsPage,
  ],
  imports: [
    IonicPageModule.forChild(DatingsPage),
  ],
})
export class DatingsPageModule {}
