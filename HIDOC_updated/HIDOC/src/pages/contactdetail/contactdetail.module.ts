import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactdetailPage } from './contactdetail';

@NgModule({
  declarations: [
    ContactdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactdetailPage),
  ],
})
export class ContactdetailPageModule {}
