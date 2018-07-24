import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';


/**
 * Generated class for the AddbiologyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addbiology',
  templateUrl: 'addbiology.html',
})
export class AddbiologyPage {
  myDate: String = new Date().toISOString();
  catagory =  [];
  value;
 


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
          firebase.database().ref('userProfile/'+this.userKey+'/biologies/'+this.id).once('value',snapShot=>{
            console.log(snapShot.val());
  
            // this.myDate= snapShot.val().date;
             this.myDate= snapShot.val().myDate;
            this.catagory=snapShot.val().catagory;
            this.value = snapShot.val().value;
           
          })
        }
  
  
      },err=>{
        console.log("unable to get the key");
      })
  }

  close() {
  this.navCtrl.setRoot('BiologyPage');
  }

  ionViewDidLoad() {

       

    }

  save() {


    console.log(this.myDate,this.catagory,this.value);

    this.enableform =false;


    let loading = this.loadingCtrl.create({
      content: 'Please wait, saving data...'
    });
  
    loading.present();


   
    if(this.myDate&&this.catagory&&this.value){
      
      if(this.id){


        firebase.database().ref('userProfile/'+this.userKey+'/biologies/'+this.id).update({
          myDate: this.myDate,
          catagory:  this.catagory,
          value : this.value

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

     

      firebase.database().ref('userProfile/'+this.userKey).child('biologies').push({
        myDate: this.myDate,
          catagory: this.catagory,
          value : this.value
        
         
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
