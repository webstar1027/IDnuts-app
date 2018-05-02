import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiverPage } from './receiver';
import {SelectSearchableModule} from "../components/select/select-module";

@NgModule({
  declarations: [
    ReceiverPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiverPage),SelectSearchableModule
  ],
})
export class ReceiverPageModule {}
