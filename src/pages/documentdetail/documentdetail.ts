import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController,Platform  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener'; 
import * as firebase from 'firebase';
import { AndroidPermissions } from '@ionic-native/android-permissions';


declare var cordova: any;

/**
 * Generated class for the DocumentdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-documentdetail',
  templateUrl: 'documentdetail.html',
})
export class DocumentdetailPage {

  loading = this.loadingCtrl.create();
  userkey: string;
  id;

  data;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl : LoadingController,public alertCtrl: AlertController,
 private document: DocumentViewer, private file: File,
  private transfer: FileTransfer,private fileOpener: FileOpener, private platform: Platform,
  private androidPermissions: AndroidPermissions) {


    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    .then(status => {
      if (status.hasPermission) {
        //  alert("permisison granted")
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        .then(status =>{
          // alert("permisison request granted");
        });
      }
    })
   

      
      this.id = this.navParams.get('id');

      console.log(this.id);
      


      this.loading.present();
      this.storage.get('userKey').then(key=>{
  
  
        console.log(key);
        this.userkey = key;
  
        firebase.database().ref('userProfile/'+key+'/documents/'+this.id).on('value',snapShot=>{
          console.log(snapShot.val());


          this.data = snapShot.val();
          console.log(this.data);
          this.loading.dismiss();
  
         
        })
  
      },err=>{
        alert("unable to get the key");
        this.loading.dismiss();
      })
  


  }


  view(name,urll){

    let loading = this.loadingCtrl.create({
      content: 'Showing document, please wait'
    });
  
    loading.present();

    let path = null;
 
    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.dataDirectory;
    }
 
    const transfer = this.transfer.create();
    // alert(path+name);
    transfer.download(urll, path + name).then(entry => {
      // alert(JSON.stringify(entry));
      // alert(JSON.stringify(entry.toURl()));
      let url = entry.toURL();
      let extension = name.split('.');
      let contentType;
      if(extension[1] ==="pdf"){
        contentType = 'application/pdf'; 
        this.document.viewDocument(url, contentType, {},function(){
          loading.dismiss();
        }, function(){},function onMissingApp(appId, installer)
        {
            loading.dismiss();
            if(confirm("Viewer app is missing!!!Do you want to install the free PDF Viewer App "
                    + appId + " for Android?"))
            {
                installer();
            }
        }  , function(){
          loading.dismiss();
          alert("Cannot view Word file")
        });
      }
      // else if(extension[1]==="docx"){

      //   alert("doc file");


        // this.file.createDir(this.file.externalRootDirectory, "appFolder", true).then(function(link){ 
          // alert(JSON.stringify(link));
          // const fileTransfer = this.transfer.create();
          // alert(urll);
          // fileTransfer.download(urll, "file:///storage/Downloads/"+name).then((entry) => {
          //   loading.dismiss();
          //   alert(JSON.stringify(entry));
          //   alert(JSON.stringify(entry.toURl()));
          //  this.fileOpener.open(entry.toURL(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document").then(
          //     function(){
          //       loading.dismiss();
          //        alert("success");
          //     },function(err){
          //       loading.dismiss()
          //         alert("status : "+err.status);
          //         alert("error : "+err.message);
          //     });
          // }, (error) => {
          //   loading.dismiss()
          //   alert(JSON.stringify(error));
          // });

      // },function(error){
      //   loading.dismiss()
      //     console.log(error);
      // });

        // alert(entry.toURL())
        // contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'   
        // this.fileOpener.open(entry.toURL(), contentType)
        // .then(() => {
        //   loading.dismiss();
        // })
        // .catch(e => {
        //   loading.dismiss();
        //   alert(JSON.stringify(e));
        // });
        // 
      // }
      else{
        alert("Invalid format")
      }
      
    });
  
  }

  



  share(){
    alert("Share details");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentdetailPage');
  }

}
