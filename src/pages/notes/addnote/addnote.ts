import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';


/**
 * Generated class for the AddnotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addnote',
  templateUrl: 'addnote.html',
})
export class AddnotePage {

  myDate: String = new Date().toISOString();
  texteLibre: String;

  constructor(private nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams) {
  }
public storeNotes(): void {
  this.nativeStorage.setItem('my-notes',{
    myDate: this.myDate,
    texteLibre: this.texteLibre
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
      this.myDate = data.myDate;
      this.texteLibre = data.texteLibre;
    },
    error => console.error(error)
  );
}

close() {
this.navCtrl.setRoot('NotesPage');
}

}
