import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddagendaPage } from './addagenda';

@NgModule({
  declarations: [
    AddagendaPage,
  ],
  imports: [
    IonicPageModule.forChild(AddagendaPage),
  ],
})
export class AddagendaPageModule {}
