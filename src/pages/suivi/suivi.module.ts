import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuiviPage } from './suivi';

@NgModule({
  declarations: [
    SuiviPage,
  ],
  imports: [
    IonicPageModule.forChild(SuiviPage),
  ],
})
export class SuiviPageModule {}
