import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';


/**
 * Generated class for the AddcontactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addcontact',
  templateUrl: 'addcontact.html',
})
export class AddcontactPage {
  contact: any = [];
  nom: string;
  prenom: string;
  specialite: string;
  telfixe: string;
  telmobile: string;
  email: string;
  adresse: string;


  constructor(public nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams) {
  }

  close() {
  this.navCtrl.setRoot('ContactPage');
  }

  ionViewDidLoad() {

        this.nativeStorage.getItem('contact').then((data) => {
          this.contact = data;
        });

    }

  addContact() {

    if(this.nom)
    {
      this.contact.push(this.nom);

      this.nativeStorage.setItem('contact', this.contact).then(()=>this.nom = 'nom');
    }

  }

  removeContact(contact) {
    let index = this.contact.indexOf(contact);

    if(index > -1){
      this.contact.splice(index, 1);
    }

    this.nativeStorage.setItem('contact', this.contact).then(()=>console.log('Item removed'));
  }
}
