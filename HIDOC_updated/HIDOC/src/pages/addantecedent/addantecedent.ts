import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';



/**
 * Generated class for the AddantecedentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addantecedent',
  templateUrl: 'addantecedent.html',
})
export class AddantecedentPage {
  myDate: String = new Date().toISOString();
  clinicalHistory: String;
  drugName: String;
  userKey: string;
  id;

  enableform = false;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,public toast: ToastController
  ,public loadingCtrl: LoadingController) {

    this.storage.get('userKey').then(key=>{
      console.log(key);
      this.userKey = key;
      this.enableform = true;

      // if we are moving from navParams

      this.id =this.navParams.get('id')
     
      if(this.id){
        firebase.database().ref('userProfile/'+this.userKey+'/clinicalHistory/'+this.id).once('value',snapShot=>{
          console.log(snapShot.val());

          this.myDate = snapShot.val().date;
          this.clinicalHistory = snapShot.val().history;
          this.drugName = snapShot.val().drug;

        })
      }


    },err=>{
      console.log("unable to get the key");
    })
  
  }

  close() {
  this.navCtrl.setRoot('AntecedentsPage');

  }

  saveAntecedent(){

    this.enableform =false;


    let loading = this.loadingCtrl.create({
      content: 'Please wait, saving data...'
    });
  
    loading.present();

  

    console.log(this.myDate,this.clinicalHistory,this.drugName);

    if(this.myDate && this.clinicalHistory && this.drugName){
      
      if(this.id){


        firebase.database().ref('userProfile/'+this.userKey+'/clinicalHistory/'+this.id).update({
          date: this.myDate,
          history: this.clinicalHistory,
          drug: this.drugName
           
        }).then(()=>{
          this.toast.create({
            message: 'Data saved',
            duration: 3000,
            position: 'top'
          }).present();
    
          this.enableform =true;
          loading.dismiss();
          this.navCtrl.pop();
  
        },err=>{
          loading.dismiss();
          this.toast.create({
            message: 'Unable to save. Try again !!!',
            duration: 3000,
            position: 'top'
          }).present();
    
          this.enableform =true;
         
  
        })

      }else{

     

      firebase.database().ref('userProfile/'+this.userKey).child('clinicalHistory').push({
        date: this.myDate,
        history: this.clinicalHistory,
        drug: this.drugName
         
      }).then(()=>{
        this.toast.create({
          message: 'Data saved',
          duration: 3000,
          position: 'top'
        }).present();
  
        this.enableform =true;
        loading.dismiss();
        this.navCtrl.pop();

      },err=>{
        loading.dismiss();
        this.toast.create({
          message: 'Unable to save. Try again !!!',
          duration: 3000,
          position: 'top'
        }).present();
  
        this.enableform =true;
       

      })

    }

    }else{
      loading.dismiss();

      this.toast.create({
        message: 'Please fill all the inputs',
        duration: 3000,
        position: 'top'
      }).present();

      this.enableform =true;
     

    }

   

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AddantecedentPage');
  }

}
