import { HomePage } from './../home/home';
import { DataProvider } from './../../providers/data/data';
import { Component,Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  @Input() data: any;
  @Input() events: any;

  public username: string;
  public password: string;
  public country: string;
  public city: string;
  public email: string;

  private isEmailValid: boolean = true;
  private isUsernameValid: boolean = true;
  private isPasswordValid: boolean = true;
  private isCityValid: boolean = true;
  private isCountryValid: boolean = true;

  private regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private navCrtl : NavController,private dataProvider: DataProvider) { 
    this.dataProvider.getRegisterData().subscribe(data=>{
      this.data = data;
    })
  }

  onEvent = (event: string): void => {
      if (event == "onRegister" && !this.validate()) {
          this.navCrtl.setRoot(HomePage);
      }
     
  }

  validate():boolean {
      this.isEmailValid = true;
      this.isUsernameValid = true;
      this.isPasswordValid = true;
      this.isCityValid = true;
      this.isCountryValid = true;

      if (!this.username ||this.username.length == 0) {
          this.isUsernameValid = false;
      }

      if (!this.password || this.password.length == 0) {
          this.isPasswordValid = false;
      }

      if (!this.password || this.password.length == 0) {
          this.isPasswordValid = false;
      }

      if (!this.city || this.city.length == 0) {
          this.isCityValid = false;
      }

      if (!this.country || this.country.length == 0) {
          this.isCountryValid = false;
      }

      this.isEmailValid = this.regex.test(this.email);

      return this.isEmailValid &&
          this.isPasswordValid &&
          this.isUsernameValid &&
          this.isCityValid &&
          this.isCountryValid;
  }

}
