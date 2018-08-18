import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, Slides, NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

import { DataProvider } from '../../providers/data/data';



/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  @Input() data: any;
    @Input() events: any;
    @ViewChild('wizardSlider') slider: Slides;

    next:boolean = true;
    finish:boolean = true

    constructor(public dataprovider : DataProvider,public navCtrl: NavController) { 
        this.next = true;
        this.finish = false;

         this.dataprovider.getIntroData().subscribe(data=>{
           this.data = data;
        })
    }

    changeSlide(index: number): void {
        if (index > 0) {
            this.slider.slideNext(300);
        } else {
            this.slider.slidePrev(300);
        }
    }

    slideHasChanged(index: number): void {
        try {
            this.next = this.slider.getActiveIndex() < (this.slider.length() - 1);
            this.finish = this.slider.isEnd();
        } catch (e) { }
    }

    onEvent(event: string) {
        this.navCtrl.setRoot(LoginPage);
    }

}
