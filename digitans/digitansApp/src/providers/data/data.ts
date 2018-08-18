import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  URL = 'http://localhost:3000/';	

  constructor(public http: HttpClient) {
    console.log('Hello DataProvider Provider');
    	
  }


  getIntroData(){
     return this.http.get(this.URL+'wizard');
  }


  getLoginData(){
    return this.http.get(this.URL+'login');
  }

  getRegisterData(){
    return this.http.get(this.URL+'register');
  }




}
