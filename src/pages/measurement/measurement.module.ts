import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeasurementPage } from './measurement';

@NgModule({
  declarations: [
    MeasurementPage,
  ],
  imports: [
    IonicPageModule.forChild(MeasurementPage),
  ],
})
export class MeasurementPageModule {}
