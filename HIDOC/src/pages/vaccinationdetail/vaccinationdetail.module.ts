import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaccinationdetailPage } from './vaccinationdetail';

@NgModule({
  declarations: [
    VaccinationdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(VaccinationdetailPage),
  ],
})
export class VaccinationdetailPageModule {}
