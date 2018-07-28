import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';


/**
 * Generated class for the AntecedentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-antecedents',
  templateUrl: 'antecedents.html',
})
export class AntecedentsPage {

  clinicalHistoryArr = [];
  loading = this.loadingCtrl.create();
  userkey: string;


  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,public loadingCtrl : LoadingController,public alertCtrl: AlertController) {
    
    this.loading.present();
    this.storage.get('userKey').then(key=>{


      console.log(key);
      this.userkey = key;

      firebase.database().ref('userProfile/'+key+'/clinicalHistory').on('value',snapShot=>{
        console.log(snapShot.val());
        this.loading.dismiss();

        this.clinicalHistoryArr = snapshotToArray(snapShot);
       this.clinicalHistoryArr = this.clinicalHistoryArr.reverse();
      })

    },err=>{
      alert("unable to get the key");
      this.loading.dismiss();
    })

   
  }

  doAntecedents() {
    this.navCtrl.push('AddantecedentPage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AntecedentsPage');
  }


  edit(id){

    // id = '-LHO4WxZY7u-ChFT_2Xt';

    this.navCtrl.push('AddantecedentPage', {id : id});

  }

  openDetailPage(id){

    console.log(id);

    this.navCtrl.push('ClinicalhistorydetailPage',{id:id});

  }

  delete(id){

    // id = '-LHO4WxZY7u-ChFT_2Xt';


    let alertt = this.alertCtrl.create({
      title: 'Are you sure',
      message: 'Do you want to Permenantly delete this post?',
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
            firebase.database().ref('userProfile/'+this.userkey+'/clinicalHistory/'+id).remove().then(data=>{

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
