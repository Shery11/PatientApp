import { FileChooser } from '@ionic-native/file-chooser';
import {File} from '@ionic-native/file';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import firebase from 'firebase';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';


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
  photoURL = "";
  photoURL1= "";
  photoURL2= "";
  base64Image;
  filename1= "Select a file";
  filename2="Select a file" ;
  filename3="Select a file";
  fileExt1;
  fileExt2;
  fileExt3;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,public toast: ToastController
    ,public loadingCtrl: LoadingController,private androidPermissions: AndroidPermissions,public camera:Camera,private file: File,
     private fileChooser: FileChooser,private filePath: FilePath) {


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
          this.photoURL = snapShot.val().doc1URL;
          this.photoURL1 = snapShot.val().doc2URL;
          this.photoURL2 = snapShot.val().doc3URL;
          this.filename1 = snapShot.val().doc1Name;
          this.filename2 = snapShot.val().doc2Name;
          this.filename3 = snapShot.val().doc3Name;
          
          

        })
      }


    },err=>{
      console.log("unable to get the key");
    })


  }

  choose1(source){
    

    this.fileChooser.open().then(uri=>{
      // alert(uri);
      this.filePath.resolveNativePath(uri)
    .then(filePath => {
    // alert(filePath);
    this.file.resolveLocalFilesystemUrl(filePath).then(newUrl=>{
      // alert(JSON.stringify(newUrl));
      
      let dirPath = newUrl.nativeURL;
      let dirPathSegments = dirPath.split('/');
      dirPathSegments.pop();
      dirPath = dirPathSegments.join('/');
      this.file.readAsArrayBuffer(dirPath,newUrl.name).then(async (buffer)=>{
        await this.upload(buffer,newUrl.name,"1");
      }).catch(error=>{
        alert("error in file");
        alert(JSON.stringify(error));
      });


    })
  })
  .catch(err => {
    alert("error in file path");
    alert(err)});
  
    }).catch(error=>{
      alert("error in file chooser");
      alert(JSON.stringify(error));
    })
 }


 async upload(buffer,name,source){

  let loading = this.loadingCtrl.create({
    content: 'Uploading document, please wait'
  });

  loading.present();
    
   let extension = name.split('.');
  // alert(extension[1]);

   if(extension[1] ==="pdf"){

    let blob = new Blob([buffer],{type:"application/pdf"});

    let storage = firebase.storage();
 
    storage.ref('files/'+name).put(blob).then(d=>{
      // alert("done");

      if(source == "1"){
        this.photoURL = d.downloadURL;
        this.filename1 = name;
     }else if(source == "2"){
        this.photoURL1 = d.downloadURL;
        this.filename2 = name;
     }else{
        this.photoURL2 = d.downloadURL
        this.filename3 = name;
     }
       
      // we have to save the download URL in some variable to save it in darabase later
      loading.dismiss()

    }).catch(error=>{
      loading.dismiss();
      alert("error in storage");
      alert(JSON.stringify(error));
     
       
    })

   }else if(extension[1]==="docx"){

    let blob = new Blob([buffer],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});

    let storage = firebase.storage();
 
    storage.ref('files/'+name).put(blob).then(d=>{
      // alert("done");
      if(source == "1"){
        this.photoURL = d.downloadURL;
        this.filename1 = name;
     }else if(source == "2"){
        this.photoURL1 = d.downloadURL;
        this.filename2 = name;
     }else{
        this.photoURL2 = d.downloadURL
        this.filename3 = name;
     }



     loading.dismiss();
       

    }).catch(error=>{
      loading.dismiss();
      alert("error in storage");
      alert(JSON.stringify(error));
    })

   }else{
     alert("Invalid format")
     loading.dismiss();
       
   }

  
 }


 

 
 choose2(source){
     
             
  this.fileChooser.open().then(uri=>{
    // alert(uri);
    this.filePath.resolveNativePath(uri)
  .then(filePath => {
  // alert(filePath);
  this.file.resolveLocalFilesystemUrl(filePath).then(newUrl=>{
    // alert(JSON.stringify(newUrl));
    
    let dirPath = newUrl.nativeURL;
    let dirPathSegments = dirPath.split('/');
    dirPathSegments.pop();
    dirPath = dirPathSegments.join('/');
    this.file.readAsArrayBuffer(dirPath,newUrl.name).then(async (buffer)=>{
      await this.upload(buffer,newUrl.name,"2");
    }).catch(error=>{
      alert("error in file");
      alert(JSON.stringify(error));
    });


  })
})
.catch(err => {
  alert("error in file path");
  alert(err)});

  }).catch(error=>{
    alert("error in file chooser");
    alert(JSON.stringify(error));
  })
}


choose3(source){
     
  this.fileChooser.open().then(uri=>{
    // alert(uri);
    this.filePath.resolveNativePath(uri)
  .then(filePath => {
  // alert(filePath);
  this.file.resolveLocalFilesystemUrl(filePath).then(newUrl=>{
    // alert(JSON.stringify(newUrl));
    
    let dirPath = newUrl.nativeURL;
    let dirPathSegments = dirPath.split('/');
    dirPathSegments.pop();
    dirPath = dirPathSegments.join('/');
    this.file.readAsArrayBuffer(dirPath,newUrl.name).then(async (buffer)=>{
      await this.upload(buffer,newUrl.name,"3");
    }).catch(error=>{
      alert("error in file");
      alert(JSON.stringify(error));
    });


  })
})
.catch(err => {
  alert("error in file path");
  alert(err)});

  }).catch(error=>{
    alert("error in file chooser");
    alert(JSON.stringify(error));
  })     

}

 save(){
  // alert(this.category+this.photoURL+this.photoURL1+this.photoURL2);

  let loading = this.loadingCtrl.create({
    content: 'Uploading document, please wait'
  });

  loading.present();


  if(this.myDate && this.category && (this.photoURL != "" || this.photoURL1!= "" || this.photoURL2!= "")){

    if(this.id){


      firebase.database().ref('userProfile/'+this.userKey+'/documents/'+this.id).update({
        category: this.category,
        myDate: this.myDate,
        doc1URL: this.photoURL,
        doc1Name: this.filename1,
        doc2URL: this.photoURL1,
        doc2Name: this.filename2,
        doc3URL: this.photoURL2, 
        doc3Name: this.filename3
         
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

    firebase.database().ref('userProfile/'+this.userKey).child('documents').push({
      category: this.category,
      myDate: this.myDate,
      doc1URL: this.photoURL,
      doc1Name: this.filename1,
      doc2URL: this.photoURL1,
      doc2Name: this.filename2,
      doc3URL: this.photoURL2, 
      doc3Name: this.filename3
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
  this.navCtrl.setRoot('DocumentPage');
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdddocumentPage');
  }



}
