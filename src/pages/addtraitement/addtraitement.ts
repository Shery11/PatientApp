import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';


/**
 * Generated class for the AddtraitementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addtraitement',
  templateUrl: 'addtraitement.html',
})
export class AddtraitementPage {
  myDate: String = new Date().toISOString();

  constructor(public nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams) {
  }

  close() {
  this.navCtrl.setRoot('TraitementPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddtraitementPage');
  }

}
