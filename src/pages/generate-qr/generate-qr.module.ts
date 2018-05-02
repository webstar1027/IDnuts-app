import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenerateQrPage } from './generate-qr';

@NgModule({
  declarations: [
    GenerateQrPage,
  ],
  imports: [
    IonicPageModule.forChild(GenerateQrPage),
  ],
})
export class GenerateQrPageModule {}
