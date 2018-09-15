import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotedetailPage } from './notedetail';

@NgModule({
  declarations: [
    NotedetailPage,
  ],
  imports: [
    IonicPageModule.forChild(NotedetailPage),
  ],
})
export class NotedetailPageModule {}
