import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchPage } from './match';
import {SelectSearchableModule} from "../components/select/select-module";
import {NgxQRCodeModule} from "ngx-qrcode2";

@NgModule({
  declarations: [
    MatchPage,
  ],
  imports: [
    IonicPageModule.forChild(MatchPage),SelectSearchableModule,
      NgxQRCodeModule
  ],
})
export class MatchPageModule {}
