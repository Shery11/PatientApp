import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';


/**
 * Generated class for the AddtraitementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addtraitement',
  templateUrl: 'addtraitement.html',
})
export class AddtraitementPage {
  myDate: String = new Date().toISOString();
  name;
  time;
  detail;
  stop;
  stoppingDetail;
  stopDate;

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
  
            this.myDate= snapShot.val().date;
             this.name= snapShot.val().name;
            this.time=snapShot.val().time;
             this.detail=snapShot.val().detail;
            this.stop=snapShot.val().stop;
             this.stoppingDetail=snapShot.val().stoppingDetail;
            this.stopDate=snapShot.val().stopDate;
  
          })
        }
  
  
      },err=>{
        console.log("unable to get the key");
      })
  }

  close() {
  this.navCtrl.setRoot('TraitementPage');
  }


  save(){
    console.log(this.name,this.time,this.detail,this.stop,this.stoppingDetail,this.stopDate);

    this.enableform =false;


    let loading = this.loadingCtrl.create({
      content: 'Please wait, saving data...'
    });
  
    loading.present();


    if(this.stop == undefined){
      this.stop = false;
      this.stoppingDetail = "";
      this.stopDate = '';
    }

  

   
    if(this.myDate && this.name&&this.time&&this.detail){
      
      if(this.id){


        firebase.database().ref('userProfile/'+this.userKey+'/treatments/'+this.id).update({
          date: this.myDate,
          name : this.name,
          time : this.time,
          detail : this.detail,
          stop : this.stop,
          stoppingDetail: this.stoppingDetail,
          stopDate: this.stopDate
           
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
        date: this.myDate,
          name : this.name,
          time : this.time,
          detail : this.detail,
          stop : this.stop,
          stoppingDetail: this.stoppingDetail,
          stopDate: this.stopDate
         
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddtraitementPage');
  }

}
