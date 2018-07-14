import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera } from '@ionic-native/camera';



/**
 * Generated class for the AddnotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addnote',
  templateUrl: 'addnote.html',
})
export class AddnotePage {

  userKey;
  enableform = false;
  id;
  sourceSelection;

  myDate;
  note;
  photoURL;
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
        firebase.database().ref('userProfile/'+this.userKey+'/notes/'+this.id).once('value',snapShot=>{
          console.log(snapShot.val());

          this.myDate =snapShot.val().myDate;
          this.note = snapShot.val().note;
          this.photoURL = snapShot.val().photoURL;
          

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
  console.log(this.myDate,this.note);

  this.enableform =false;


  let loading = this.loadingCtrl.create({
    content: 'Please wait, saving data...'
  });

  loading.present();


  if(this.base64Image){
    this.photoURL = this.base64Image;
  }else{
    this.photoURL = 'https://www.ppihotline.co.uk/wp-content/uploads/2017/02/placeholder-image.jpg';
  }





  if(this.myDate && this.note){
    
    if(this.id){


      firebase.database().ref('userProfile/'+this.userKey+'/notes/'+this.id).update({
        category: this.myDate,
        note: this.note,
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


     
   

    firebase.database().ref('userProfile/'+this.userKey).child('notes').push({
        category: this.myDate,
        note: this.note,
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

close() {
this.navCtrl.setRoot('NotesPage');
}

}
