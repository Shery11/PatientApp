import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AntecedentsPage } from './antecedents';

@NgModule({
  declarations: [
    AntecedentsPage,
  ],
  imports: [
    IonicPageModule.forChild(AntecedentsPage),
  ],
})
export class AntecedentsPageModule {}
