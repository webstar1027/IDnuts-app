import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KidsListPage } from './kids-list';

@NgModule({
  declarations: [
    KidsListPage,
  ],
  imports: [
    IonicPageModule.forChild(KidsListPage),
  ],
})
export class KidsListPageModule {}
