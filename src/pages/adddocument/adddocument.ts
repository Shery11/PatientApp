import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import * as firebase from 'firebase';

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
   
  myDate: String = new Date().toISOString();
  catagory;


  userKey: string;
  id;

  enableform = false;
  
  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,public toast: ToastController
    ,public loadingCtrl: LoadingController,public file: File, public fileChooser: FileChooser,private androidPermissions: AndroidPermissions ) {

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        success => alert('Permission granted'),
        err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
      );


      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
        success => alert("permission Given"),
        err => this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE) 
      )

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        success => alert("permission Given"),
        err => this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE) 
      )


      

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdddocumentPage');
  }


  choose(){
    this.fileChooser.open().then((uri)=>{
      alert(uri);
      this.file.resolveLocalFilesystemUrl(uri).then((url)=>{
        alert(JSON.stringify(url));

        let dirPath = url.nativeURL;

        let dirPathSegments = dirPath.split('/');
         dirPathSegments.pop();

         dirPath = dirPathSegments.join('/');

         alert(dirPath);

         this.file.readAsDataURL(dirPath,url.name).then(base64=>{
           alert(base64);
          const filename = Math.floor(Date.now() / 1000);
          firebase.storage().ref().child(`files/${filename}.jpg`).
          putString(base64, 'base64').then((snapShot)=>{

            alert(JSON.stringify(snapShot));

          }).catch(e=>{
            alert("error in storage")
            alert(JSON.stringify(e));
          })
         }).catch(e=>{
          alert("error in File plugin")
           alert(JSON.stringify(e));
         })

        //  this.file.readAsArrayBuffer(dirPath,url.name).then((buffer)=>{
        //     // this.upload(buffer,url.name);

        //     let blob = new Blob([buffer],{type:'image/jpeg'})

        //     alert(blob);
        
        //     firebase.storage().ref('files/'+url.name).put(blob).then((d)=>{
        //       alert(JSON.stringify(d));
        //     }).catch(e=>{
        //       alert(e);
        //     })
        // }).catch(e=>{
        //   alert(JSON.stringify(e));
        // })

      })
    })

  }

   upload(buffer,name){
    // create a blob
    let blob = new Blob([buffer],{type:'image/jpeg'})

    alert(blob);

    firebase.storage().ref('files/'+name).put(blob).then((d)=>{
      alert(JSON.stringify(d));
    }).catch(e=>{
      alert(e);
    })
  }

}
