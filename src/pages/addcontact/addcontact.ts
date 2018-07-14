import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';


/**
 * Generated class for the AddcontactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addcontact',
  templateUrl: 'addcontact.html',
})
export class AddcontactPage {
  contacts: any = [];
  name: string;
  surname: string;
  speciality: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;


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
          firebase.database().ref('userProfile/'+this.userKey+'/treatments/'+this.id).once('value',snapShot=>{
            console.log(snapShot.val());
  
            // this.myDate= snapShot.val().date;
             this.name= snapShot.val().name;
            this.surname=snapShot.val().surname;
             this.speciality=snapShot.val().speciality;
            this.phone=snapShot.val().phone;
             this.mobile=snapShot.val().mobile;
            this.email=snapShot.val().email;
            this.address =  snapShot.val().address;
  
          })
        }
  
  
      },err=>{
        console.log("unable to get the key");
      })
  }

  close() {
  this.navCtrl.setRoot('ContactPage');
  }

  ionViewDidLoad() {

       

    }

  save() {


    console.log(this.name,this.surname,this.speciality,this.phone,this.mobile,this.email,this.address);

    this.enableform =false;


    let loading = this.loadingCtrl.create({
      content: 'Please wait, saving data...'
    });
  
    loading.present();


   
    if(this.name&&this.surname&&this.speciality&&this.phone&&this.mobile&&this.email&&this.address){
      
      if(this.id){


        firebase.database().ref('userProfile/'+this.userKey+'/contacts/'+this.id).update({
          name: this.name,
          surname: this.surname,
           speciality: this.speciality,
          phone: this.phone,
          mobile: this.mobile,
          email: this.email,
          address: this.address
           
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

     

      firebase.database().ref('userProfile/'+this.userKey).child('treatments').push({
        name: this.name,
        surname: this.surname,
         speciality: this.speciality,
        phone: this.phone,
        mobile: this.mobile,
        email: this.email,
        address: this.address
         
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
