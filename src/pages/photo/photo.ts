import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';
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

  galleryType = 'regular';
  imagesArr = [];
  
  loading = this.loadingCtrl.create();
  userkey: string;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl : LoadingController,public alertCtrl: AlertController) {


      
      this.loading.present();
      this.storage.get('userKey').then(key=>{
  
  
        console.log(key);
        this.userkey = key;
  
        firebase.database().ref('userProfile/'+key+'/photos').on('value',snapShot=>{
          console.log(snapShot.val());
          this.loading.dismiss();
  
          this.imagesArr = snapshotToArray(snapShot);
         this.imagesArr = this.imagesArr.reverse();
         console.log(this.imagesArr);

        })
  
      },err=>{
        alert("unable to get the key");
        this.loading.dismiss();
      })
  }
  doPhoto() {
    this.navCtrl.push('AddphotoPage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoPage');
  }




}



export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};

