import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';

/**
 * Generated class for the AddmeasurementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addmeasurement',
  templateUrl: 'addmeasurement.html',
})
export class AddmeasurementPage {
  myDate: String = new Date().toISOString();
  gender;
  weight;
  size;
  tensionArt;
  temperature;
  


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
          firebase.database().ref('userProfile/'+this.userKey+'/measurments/'+this.id).once('value',snapShot=>{
            console.log(snapShot.val());
  
            // this.myDate= snapShot.val().date;
             this.myDate= snapShot.val().myDate;
            this.gender=snapShot.val().gender;
            this.weight = snapShot.val().weight;
            this.size = snapShot.val().size;
            this.temperature = snapShot.val().temperature;
            this.tensionArt = snapShot.val().tensionArt;

           
          })
        }
  
  
      },err=>{
        console.log("unable to get the key");
      })
  }

  close() {
  this.navCtrl.setRoot('MeasurementPage');
  }

  ionViewDidLoad() {

       

    }

  save() {


    console.log(this.myDate,this.gender,this.weight,this.size,this.temperature,this.tensionArt);

    this.enableform =false;


    let loading = this.loadingCtrl.create({
      content: 'Please wait, saving data...'
    });
  
    loading.present();


   
    if(this.myDate&&this.gender&&this.weight&&this.size&&this.temperature&&this.tensionArt){
      
      if(this.id){


        firebase.database().ref('userProfile/'+this.userKey+'/measurments/'+this.id).update({
          myDate: this.myDate,
          gender:  this.gender,
          weight:  this.weight,
          size:  this.size,
          temperature:  this.temperature,
          tensionArt:  this.tensionArt,
       
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

     

      firebase.database().ref('userProfile/'+this.userKey).child('measurments').push({
          myDate: this.myDate,
          gender:  this.gender,
          weight:  this.weight,
          size:  this.size,
          temperature:  this.temperature,
          tensionArt:  this.tensionArt,
         
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

  removeContact(contact) {
   
  }
}
