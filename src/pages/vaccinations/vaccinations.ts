import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';


/**
 * Generated class for the VaccinationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vaccinations',
  templateUrl: 'vaccinations.html',
})
export class VaccinationsPage {

  constructor(public nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams) {
  }
  doVaccinations() {
    this.navCtrl.push('AddvaccinationPage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad VaccinationsPage');
  }

}
