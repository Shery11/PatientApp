import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';

/**
 * Generated class for the DocumentdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-documentdetail',
  templateUrl: 'documentdetail.html',
})
export class DocumentdetailPage {

  loading = this.loadingCtrl.create();
  userkey: string;
  id;

  data;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl : LoadingController,public alertCtrl: AlertController) {

      
      this.id = this.navParams.get('id');

      console.log(this.id);
      


      this.loading.present();
      this.storage.get('userKey').then(key=>{
  
  
        console.log(key);
        this.userkey = key;
  
        firebase.database().ref('userProfile/'+key+'/documents/'+this.id).on('value',snapShot=>{
          console.log(snapShot.val());


          this.data = snapShot.val();
          console.log(this.data);
          this.loading.dismiss();
  
         
        })
  
      },err=>{
        alert("unable to get the key");
        this.loading.dismiss();
      })
  


  }


  share(){
    alert("Share details");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentdetailPage');
  }

}
