import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import firebase from 'firebase';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera } from '@ionic-native/camera';


/**
 * Generated class for the AdddocumentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adddocument',
  templateUrl: 'adddocument.html',
})
export class AdddocumentPage {
   
  userKey;
  enableform = false;
  id;
  sourceSelection;

  category;
  myDate;
  photoURL;
  photoURL1;
  photoURL2;
  base64Image;
  filename1= "Select a file";
  filename2="Select a file" ;
  filename3="Select a file";

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
        
        

        firebase.database().ref('userProfile/'+this.userKey+'/documents/'+this.id).once('value',snapShot=>{
          console.log(snapShot.val());

          this.category =snapShot.val().category;
          this.myDate = snapShot.val().myDate;
          this.photoURL = snapShot.val().photoURL;
          this.photoURL1 = snapShot.val().photoURL1;
          this.photoURL2 = snapShot.val().photoURL2;
          

        })
      }


    },err=>{
      console.log("unable to get the key");
    })


  }

  choose1(source){
     
             
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

        alert(JSON.stringify(imageData));
           
        let loading = this.loadingCtrl.create({
          content: 'Please wait, saving data...'
        });
        const filename = Math.floor(Date.now() / 1000);
        firebase.storage().ref().child(`images/${filename}.jpg`).
        putString(this.base64Image, 'data_url').then((snapShot)=>{
            this.photoURL = snapShot.downloadURL;
            this.filename1 = filename+"";
            loading.dismiss();
        },(err)=>{
          loading.dismiss();
          alert(err);
        });

     }, (err) => {
         console.log(err);
         alert(err);
        
     });
 }

 
 choose2(source){
     
             
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
         
      let loading = this.loadingCtrl.create({
        content: 'Please wait, saving data...'
      });
      const filename = Math.floor(Date.now() / 1000);
      firebase.storage().ref().child(`images/${filename}.jpg`).
      putString(this.base64Image, 'data_url').then((snapShot)=>{
          this.photoURL1 = snapShot.downloadURL;
          this.filename2 = filename+"";
          loading.dismiss();
      },(err)=>{
        loading.dismiss();
        alert(err);
      });

   }, (err) => {
       console.log(err);
       alert(err);
      
   });
}


choose3(source){
     
             
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
         
      let loading = this.loadingCtrl.create({
        content: 'Please wait, saving data...'
      });
      const filename = Math.floor(Date.now() / 1000);
      firebase.storage().ref().child(`images/${filename}.jpg`).
      putString(this.base64Image, 'data_url').then((snapShot)=>{
          this.photoURL2 = snapShot.downloadURL;
          this.filename3 = filename+"";
          loading.dismiss();
      },(err)=>{
        loading.dismiss();
        alert(err);
      });

   }, (err) => {
       console.log(err);
       alert(err);
      
   });
}

 save(){
  alert(this.category+this.photoURL+this.photoURL1+this.photoURL2);


 

}



  close() {
  this.navCtrl.setRoot('DocumentPage');
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdddocumentPage');
  }



}
