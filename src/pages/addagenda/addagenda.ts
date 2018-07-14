import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';


/**
 * Generated class for the AddagendaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addagenda',
  templateUrl: 'addagenda.html',
})
export class AddagendaPage {
  myDate: String = new Date().toISOString();

  constructor(public nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams) {
  }

  close() {
  this.navCtrl.setRoot('AgendaPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddagendaPage');
  }

}
