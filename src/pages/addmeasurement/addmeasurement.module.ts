import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddmeasurementPage } from './addmeasurement';

@NgModule({
  declarations: [
    AddmeasurementPage,
  ],
  imports: [
    IonicPageModule.forChild(AddmeasurementPage),
  ],
})
export class AddmeasurementPageModule {}
