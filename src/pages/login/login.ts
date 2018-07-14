import { MenuPage } from './../menu/menu';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, LoadingController,ToastController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
login_reg: string = "login";
public loginForm: FormGroup;
public registerForm: FormGroup;
public loading;

  constructor(public storage: Storage,public loadingCtrl: LoadingController, public formBuilder: FormBuilder,public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController, public menuCtrl: MenuController,public authProvider:AuthProvider,public toast : ToastController) {
      this.menuCtrl.swipeEnable(false);

      this.loginForm =formBuilder.group({
        email: ['', 
        Validators.compose([Validators.required])],
        password: ['', 
        Validators.compose([Validators.minLength(6), Validators.required])]
      });


      this.registerForm = formBuilder.group({
        email: ['', 
          Validators.compose([Validators.required])],
        password: ['', 
          Validators.compose([Validators.minLength(6), Validators.required])],
        name: ['', 
          Validators.compose([Validators.minLength(6), Validators.required])]
      });
     
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

   
  }


  login(){

    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authProvider.loginUser(this.loginForm.value.email, 
        this.loginForm.value.password)
      .then( authData => {
        console.log(authData);
        this.loading.dismiss().then( () => {
         
            this.storage.set('userKey', authData.user.uid);
            this.navCtrl.setRoot(MenuPage);
          
        });
      }, error => {

        console.log(error)
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
              });
            });
            this.loading = this.loadingCtrl.create();
            this.loading.present();
          }

  }


  register(){

    if (!this.registerForm.valid){
      console.log(this.registerForm.value);
    } else {
      this.authProvider.signupUser(this.registerForm.value.email, 
        this.registerForm.value.password, this.registerForm.value.name)
      .then( authData => {
        console.log(authData);
        this.loading.dismiss().then( () => {
          // this.navCtrl.setRoot(MenuPage);
        
            let toast = this.toast.create({
              message: 'User registration successful Now login using same credentials',
              duration: 3000,
              position: 'middle'
            });
          
            toast.onDidDismiss(() => {

              this.login_reg = "login";
              console.log('Dismissed toast');
            });
          
            toast.present();
          
        });
      }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        // });
      });
    });
  
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  
    } 

  }

  forgotPassword() {
    let forgotpas = this.alertCtrl.create({
      title: 'Forgot password',
      message: "Enter your email address and we'll help you reset your password",
      inputs: [
        {
          name: 'email',
          placeholder: 'E-mail'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log(data);
            this.authProvider.resetPassword(data.email).then(data=>{

              this.toast.create({
                message: 'Password Reset email sent successfully',
                duration: 3000,
                position: 'top'
              }).present();
                
            },err=>{
              this.toast.create({
                message: 'Unable to send Password reset email! Try Again',
                duration: 3000,
                position: 'top'
              }).present();
            }) ;
            console.log('Send clicked');
          }
        }
      ]
    });
    forgotpas.present();
  }

}
