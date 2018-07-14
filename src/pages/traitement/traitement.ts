import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';


/**
 * Generated class for the TraitementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-traitement',
  templateUrl: 'traitement.html',
})
export class TraitementPage {

  constructor(public nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams) {
  }

  doTraitement() {
    this.navCtrl.push('AddtraitementPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TraitementPage');
  }

}
