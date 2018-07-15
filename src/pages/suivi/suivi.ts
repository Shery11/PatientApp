import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';

/**
 * Generated class for the SuiviPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-suivi',
  templateUrl: 'suivi.html',
})
export class SuiviPage {


  clinicalHistoryArr = [];
  treatmentArr = [];
  vaccinesArr = [];
  measurmentArr = [];
  
  loading = this.loadingCtrl.create();
  userkey: string;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl : LoadingController,public alertCtrl: AlertController) {


      
      this.loading.present();
      this.storage.get('userKey').then(key=>{
  
  
        console.log(key);
        this.userkey = key;
  
        firebase.database().ref('userProfile/'+key+'/clinicalHistory').on('value',snapShot=>{
          console.log(snapShot.val());
          this.loading.dismiss();
  
          this.clinicalHistoryArr = snapshotToArray(snapShot);
          this.clinicalHistoryArr = this.clinicalHistoryArr.reverse();
          console.log(this.clinicalHistoryArr);

          if (this.clinicalHistoryArr.length > 3) {
            this.clinicalHistoryArr.length = 3;
          }

          console.log(this.clinicalHistoryArr);
        


        });

        firebase.database().ref('userProfile/'+key+'/treatments').on('value',snapShot=>{
          console.log(snapShot.val());
       
          this.treatmentArr = snapshotToArray(snapShot);
          this.treatmentArr = this.treatmentArr.reverse();
          console.log(this.treatmentArr);

          if (this.treatmentArr.length > 3) {
            this.treatmentArr.length = 3;
          }

          console.log(this.treatmentArr);
        


        })

        firebase.database().ref('userProfile/'+key+'/vaccines').on('value',snapShot=>{
          console.log(snapShot.val());
       
          this.vaccinesArr = snapshotToArray(snapShot);
          this.vaccinesArr = this.vaccinesArr.reverse();
          console.log(this.vaccinesArr);

          if (this.vaccinesArr.length > 3) {
            this.vaccinesArr.length = 3;
          }

          console.log(this.vaccinesArr);
        


        })

        firebase.database().ref('userProfile/'+key+'/measurments').on('value',snapShot=>{
          console.log(snapShot.val());
        
          this.measurmentArr = snapshotToArray(snapShot);
         this.measurmentArr = this.measurmentArr.reverse();
         console.log(this.measurmentArr);

         if (this.measurmentArr.length > 3) {
          this.measurmentArr.length = 3;
        }

        console.log(this.measurmentArr);
        


        })
  
      },err=>{
        alert("unable to get the key");
        this.loading.dismiss();
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuiviPage');
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