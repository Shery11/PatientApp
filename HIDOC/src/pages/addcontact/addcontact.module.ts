import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddcontactPage } from './addcontact';

@NgModule({
  declarations: [
    AddcontactPage,
  ],
  imports: [
    IonicPageModule.forChild(AddcontactPage),
  ],
})
export class AddcontactPageModule {}
