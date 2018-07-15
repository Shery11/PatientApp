import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera } from '@ionic-native/camera';




/**
 * Generated class for the AddvaccinationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addvaccination',
  templateUrl: 'addvaccination.html',
})
export class AddvaccinationPage {

  userKey;
  enableform = false;
  id;
  sourceSelection;


  name;
  availableVaccines;
  sDate;
  rDate;
  details;
  photoURL = 'http://tradepending.com/wp-content/uploads/2015/03/placeholder.png';
  base64Image;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,public toast: ToastController
    ,public loadingCtrl: LoadingController,private androidPermissions: AndroidPermissions,public camera:Camera,) {


      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        success => console.log('Permission granted'),
        err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
      );


      
    this.storage.get('userKey').then(key=>{
      console.log(key);
      this.userKey = key;
      this.enableform = true;

      // if we are moving from navParams

      this.id =this.navParams.get('id')
     
      if(this.id){
        firebase.database().ref('userProfile/'+this.userKey+'/vaccines/'+this.id).once('value',snapShot=>{
          console.log(snapShot.val());

          // this.myDate = snapShot.val().date;
          // this.clinicalHistory = snapShot.val().history;
          // this.drugName = snapShot.val().drug;

          this.name =snapShot.val().name;
          this.availableVaccines = snapShot.val().availableVaccines;
          this.sDate=snapShot.val().startDate;
          this.rDate=snapShot.val().remainderDate;
          this.details=snapShot.val().details;
          this. photoURL=snapShot.val().photoURL;
          this.base64Image=snapShot.val().photoURL;

        })
      }


    },err=>{
      console.log("unable to get the key");
    })


  }


  takePicture(source){
     
             
    if(source=="camera"){
       this.sourceSelection = this.camera.PictureSourceType.CAMERA;
    }else if(source=="gallery"){
       this.sourceSelection = this.camera.PictureSourceType.PHOTOLIBRARY;
       // alert(source);
   }
     this.camera.getPicture({
         sourceType:this.sourceSelection,
         destinationType: this.camera.DestinationType.DATA_URL,
         encodingType: this.camera.EncodingType.JPEG,
         mediaType: this.camera.MediaType.PICTURE,
         quality: 100
      }).then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
     }, (err) => {
         console.log(err);
         alert(err);
        
     });
}





  save(){
    console.log(this.name,this.details,this.sDate,this.rDate,this.availableVaccines);

    this.enableform =false;


    let loading = this.loadingCtrl.create({
      content: 'Please wait, saving data...'
    });
  
    loading.present();


  
    if(this.base64Image){

      const filename = Math.floor(Date.now() / 1000);
      firebase.storage().ref().child(`images/${filename}.jpg`).
      putString(this.base64Image, 'data_url').then((snapShot)=>{
          if(this.name && this.details && this.sDate &&this.rDate && this.availableVaccines){
        
    
    
            if(this.id){
        
            firebase.database().ref('userProfile/'+this.userKey+'/vaccines/'+this.id).update({
                name: this.name,
                details: this.details,
                startDate: this.sDate,
                remainderDate: this.rDate,
                availableVaccines: this.availableVaccines,
                photoURL: snapShot.downloadURL
                 
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
        
        
             
           
        
            firebase.database().ref('userProfile/'+this.userKey).child('vaccines').push({
              name: this.name,
              details: this.details,
              startDate: this.sDate,
              remainderDate: this.rDate,
              availableVaccines: this.availableVaccines,
              photoURL: snapShot.downloadURL
               
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
        }, (err)=>{
          loading.dismiss()
          alert(err);
        });
    
      }else{
    
        
    
    
        if(this.name && this.details && this.sDate &&this.rDate && this.availableVaccines){
        
    
    
          if(this.id){
      
          
      
      
            firebase.database().ref('userProfile/'+this.userKey+'/vaccines/'+this.id).update({
              name: this.name,
              details: this.details,
              startDate: this.sDate,
              remainderDate: this.rDate,
              availableVaccines: this.availableVaccines,
              photoURL: this.photoURL
               
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
      
      
           
         
      
          firebase.database().ref('userProfile/'+this.userKey).child('vaccines').push({
            name: this.name,
            details: this.details,
            startDate: this.sDate,
            remainderDate: this.rDate,
            availableVaccines: this.availableVaccines,
            photoURL: this.photoURL
             
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

   

  }

   
  

  close() {
  this.navCtrl.setRoot('VaccinationsPage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddvaccinationPage');
  }

}




// name: this.name,
// details: this.details,
// startDate: this.sDate,
// remainderDate: this.rDate,
// availableVaccines: this.availableVaccines,
// photoURL: this.photoURL



// this.name && this.details && this.sDate &&this.rDate && this.availableVaccines
