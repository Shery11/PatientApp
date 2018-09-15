import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';

/**
 * Generated class for the DocumentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-document',
  templateUrl: 'document.html',
})
export class DocumentPage {

  documentsArr = [];
  loading = this.loadingCtrl.create();
  userkey: string;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl : LoadingController,public alertCtrl: AlertController) {

      this.loading.present();
      this.storage.get('userKey').then(key=>{
  
  
        console.log(key);
        this.userkey = key;
  
        firebase.database().ref('userProfile/'+key+'/documents').on('value',snapShot=>{
          console.log(snapShot.val());
          this.loading.dismiss();
  
          this.documentsArr = snapshotToArray(snapShot);
         this.documentsArr = this.documentsArr.reverse();
        })
  
      },err=>{
        alert("unable to get the key");
        this.loading.dismiss();
      })
  

  }

  doDocument() {
    this.navCtrl.push('AdddocumentPage');
  }


  edit(id){

    console.log(id);

    this.navCtrl.push('AdddocumentPage', {id : id});

  }

  delete(id){
  console.log(id);


    let alertt = this.alertCtrl.create({
      title: 'Are you sure',
      message: 'Do you want to Permenantly delete this treatment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            firebase.database().ref('userProfile/'+this.userkey+'/documents/'+id).remove().then(data=>{

              alert("deleted successfully");
      
            }, err=>{
              alert("Try again,Err while deleting");
            });
          }
        }
      ]
    });

    alertt.present();

  }



  openDetail(id){
    console.log(id);

    this.navCtrl.push('DocumentdetailPage',{id:id});
  }




  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentPage');
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