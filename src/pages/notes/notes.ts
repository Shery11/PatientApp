import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the NotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {
  name: string;
  surname: string;
  years: number;

  constructor(private nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams) {
  }
  public storeNotes(): void {
  this.nativeStorage.setItem('my-notes',{
    name: this.name,
    surname: this.surname,
    years: this.years
    })

  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );

  }
  public getMyNotes(): void {
  this.nativeStorage.getItem('my-notes')
  .then(
    data =>{
      this.name = data.name;
      this.surname = data.surname;
      this.years = data.years;
    },
    error => console.error(error)
  );
  }
  doNotes() {
    this.navCtrl.push('AddnotePage');
  }

  }
