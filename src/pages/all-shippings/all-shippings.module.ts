import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllShippingsPage } from './all-shippings';

@NgModule({
  declarations: [
    AllShippingsPage,
  ],
  imports: [
    IonicPageModule.forChild(AllShippingsPage),
  ],
})
export class AllShippingsPageModule {}
