import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotodetailPage } from './photodetail';

@NgModule({
  declarations: [
    PhotodetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PhotodetailPage),
  ],
})
export class PhotodetailPageModule {}
