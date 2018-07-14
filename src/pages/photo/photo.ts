import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';


/**
 * Generated class for the PhotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {

  constructor(public nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams) {
  }
  doPhoto() {
    this.navCtrl.push('AddphotoPage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoPage');
  }

}