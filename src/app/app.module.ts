import { AndroidPermissions } from '@ionic-native/android-permissions';
import { MenuPage } from './../pages/menu/menu';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Tabs } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { NativeStorage } from '@ionic-native/native-storage';
import { SecureStorage } from '@ionic-native/secure-storage';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { Calendar } from '@ionic-native/calendar';
import { AuthProvider } from '../providers/auth/auth';
import { LoginPage } from '../pages/login/login';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';


var config = {
      backButtonText: '',
      backButtonIcon: 'md-arrow-back',
      iconMode: 'ios',
      pageTransition: 'ios',
      mode:'ios'
    };

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    MenuPage,
   ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,config),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    MenuPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    NativeStorage,
    SecureStorage,
    IonicStorageModule,
    Camera,
    File,
    FilePath,
    FileChooser,
    DocumentViewer,
    FileTransfer,
    FileOpener,
    AndroidPermissions,
    Calendar,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider
  ]
})
export class AppModule {}
