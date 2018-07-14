import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(public storage: Storage) {
    firebase.initializeApp({
      apiKey: "AIzaSyCajZFsB4UT0WGKB-H9t-imZWt-br1G4nY",
      authDomain: "hidoc-fd1da.firebaseapp.com",
      databaseURL: "https://hidoc-fd1da.firebaseio.com",
      projectId: "hidoc-fd1da",
      storageBucket: "",
      messagingSenderId: "547674484860"
    })
  }


  loginUser(email: string, password: string): Promise<any> {
	  return firebase.auth().signInWithEmailAndPassword(email, password);
	}

	signupUser(email: string, password: string,name:string): Promise<any> {
	  return firebase
	  .auth()
	  .createUserWithEmailAndPassword(email, password)
	  .then( newUser => {
			console.log(newUser);
			// this.storage.set('userKey', newUser.user.uid);
        
	    firebase
	    .database()
	    .ref('/userProfile')
	    .child(newUser.user.uid)
	    .set({ email: email, name : name });
	  });
	}

	resetPassword(email: string): Promise<void> {
	  return firebase.auth().sendPasswordResetEmail(email);
	}

	logoutUser(): Promise<void> {
	  return firebase.auth().signOut();
	}

}
