import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KidsInfoPage } from './kids-info';
import { NgxQRCodeModule} from "ngx-qrcode2";
@NgModule({
  declarations: [
    KidsInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(KidsInfoPage),
      NgxQRCodeModule
  ],
})
export class KidsInfoPageModule {}
