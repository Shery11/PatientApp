import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';



/**
 * Generated class for the AddagendaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addagenda',
  templateUrl: 'addagenda.html',
})
export class AddagendaPage {
  myDate: String = new Date().toISOString();
  name;
  place;
  note;


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
          firebase.database().ref('userProfile/'+this.userKey+'/agendas/'+this.id).once('value',snapShot=>{
            console.log(snapShot.val());
  
            this.myDate= snapShot.val().date;
             this.name= snapShot.val().name;
            this.place=snapShot.val().place;
             this.note=snapShot.val().note;
            
          })
        }
  
  
      },err=>{
        console.log("unable to get the key");
      })
  }

  close() {
  this.navCtrl.setRoot('AgendaPage');
  }


  save(){
    console.log(this.name,this.myDate,this.place,this.note);

    this.enableform =false;


    let loading = this.loadingCtrl.create({
      content: 'Please wait, saving data...'
    });
  
    loading.present();


   
    if(this.myDate && this.myDate&&this.place&&this.note){
      
      if(this.id){


        firebase.database().ref('userProfile/'+this.userKey+'/agendas/'+this.id).update({
          date: this.myDate,
          name : this.name,
          place : this.place,
          note: this.note
           
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

     

      firebase.database().ref('userProfile/'+this.userKey).child('agendas').push({
        date: this.myDate,
        name : this.name,
        place : this.place,
        note: this.note
         
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
    console.log('ionViewDidLoad AddagendaPage');
  }

}
