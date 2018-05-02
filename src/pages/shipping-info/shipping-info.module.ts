import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShippingInfoPage } from './shipping-info';
import {NgxQRCodeModule} from "ngx-qrcode2";

@NgModule({
  declarations: [
    ShippingInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ShippingInfoPage),
      NgxQRCodeModule
  ],
})
export class ShippingInfoPageModule {}
