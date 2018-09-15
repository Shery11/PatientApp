import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaccinationsPage } from './vaccinations';

@NgModule({
  declarations: [
    VaccinationsPage,
  ],
  imports: [
    IonicPageModule.forChild(VaccinationsPage),
  ],
})
export class VaccinationsPageModule {}
