import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParentPage } from './parent';
import { SelectSearchableModule } from "../components/select/select-module";

@NgModule({
  declarations: [
    ParentPage,
  ],
  imports: [
    IonicPageModule.forChild(ParentPage),SelectSearchableModule
  ],
})
export class ParentPageModule {}
