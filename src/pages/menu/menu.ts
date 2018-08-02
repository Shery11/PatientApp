import { AuthProvider } from './../../providers/auth/auth';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';


export interface PageInterface {
title: string;
pageName: string;
tabComponement?: any;
index?: number;
icon: string;

}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  rootPage ='TabsPage';

  @ViewChild(Nav) nav: Nav;
   pages: PageInterface [] = [
       { title: 'Home', pageName: 'TabsPage', tabComponement: 'SuiviPage', index: 0, icon: 'briefcase'},
       { title: 'Treatment', pageName: 'TabsPage', tabComponement: 'TraitementPage', index: 1, icon: 'document'},
       { title: 'Contact', pageName: 'TabsPage', tabComponement: 'ContactPage', index: 2, icon: 'contact'},
       { title: 'Agenda', pageName: 'TabsPage', tabComponement: 'AgendaPage', index: 3, icon: 'calendar'},
       { title: 'Photo', pageName: 'TabsPage', tabComponement: 'PhotoPage', index: 4, icon: 'camera'},
       { title: 'Notes', pageName: 'NotesPage', icon: 'book'},
       { title: 'Clinical history', pageName: 'AntecedentsPage', icon: 'paper' },
       { title: 'Vaccinations', pageName: 'VaccinationsPage', icon: 'paper' },
       { title: 'Biology', pageName: 'BiologyPage', icon: 'paper' },
       { title: 'Document', pageName: 'DocumentPage', icon: 'paper' },
       { title: 'Measurment', pageName: 'MeasurementPage', icon: 'paper' },
   ]

   constructor(public toast: ToastController, public navCtrl: NavController, public navParams: NavParams,public authProvider:AuthProvider) {
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad Dashboard');
   }
   openPage(page: PageInterface) {
     let params = {};
     if (page.index) {
       params = { pageIndex: page.index};
     }

     if (this.nav.getActiveChildNavs()[0] && page.index != undefined) {
         this.nav.getActiveChildNavs()[0].select(page.index);
     } else {
       this.nav.setRoot(page.pageName, params);

     }

 }
 isActive(page: PageInterface) {
   let childNav = this.nav.getActiveChildNavs()[0];

   if (childNav) {
     if (childNav.getSelected() && childNav.getSelected().root === page.tabComponement)
       return 'primary';
   }

 return;
 }


 logout(){

  this.authProvider.logoutUser().then(()=>{

    
      let toast = this.toast.create({
        message: 'User logged out successfully',
        duration: 1000,
        position: 'top'
      });
    
      toast.onDidDismiss(() => {
        this.navCtrl.setRoot(LoginPage);
      });
    
      toast.present();
    
    
  },err=>{

    let toast = this.toast.create({
      message: 'Unable to logout user',
      duration: 1000,
      position: 'top'
    });
  
    toast.present();

  })
   
 }




 }
