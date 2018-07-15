import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import firebase from 'firebase';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera } from '@ionic-native/camera';




/**
 * Generated class for the AddphotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addphoto',
  templateUrl: 'addphoto.html',
})
export class AddphotoPage {

  userKey;
  enableform = false;
  id;
  sourceSelection;

  category;
  note;
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
        
        

        firebase.database().ref('userProfile/'+this.userKey+'/photos/'+this.id).once('value',snapShot=>{
          console.log(snapShot.val());

          this.category =snapShot.val().category;
          this.note = snapShot.val().note;
          this.photoURL = snapShot.val().photoURL;
          this.base64Image = snapShot.val().photoURL;
          

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
  console.log(this.category,this.note);

  this.enableform =false;


  let loading = this.loadingCtrl.create({
    content: 'Please wait, saving data...'
  });

  loading.present();

  if(this.base64Image){

  const filename = Math.floor(Date.now() / 1000);
  firebase.storage().ref().child(`images/${filename}.jpg`).
  putString(this.base64Image, 'data_url').then((snapShot)=>{
      if(this.category && this.note){
    


        if(this.id){
    
        firebase.database().ref('userProfile/'+this.userKey+'/photos/'+this.id).update({
            category: this.category,
            note: this.note,
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
    
    
         
       
    
        firebase.database().ref('userProfile/'+this.userKey).child('photos').push({
            category: this.category,
            note: this.note,
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

    


    if(this.category && this.note){
    


      if(this.id){
  
      
  
  
        firebase.database().ref('userProfile/'+this.userKey+'/photos/'+this.id).update({
          category: this.category,
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
  
  
       
     
  
      firebase.database().ref('userProfile/'+this.userKey).child('photos').push({
          category: this.category,
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

  

 

}



  close() {
  this.navCtrl.setRoot('PhotoPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddphotoPage');
  }

}
