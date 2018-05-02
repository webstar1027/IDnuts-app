import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import {Config, Nav, Platform, ToastController,Events} from 'ionic-angular';
import { User } from '../providers/providers';
import {FirstRunPage} from '../pages/pages';
import { Settings } from '../providers/providers';
import { Storage} from "@ionic/storage";
import { LocalNotifications } from "@ionic-native/local-notifications";
declare var cordova: any;
@Component({
  templateUrl:'app.html'
})
export class MyApp {
  rootPage = FirstRunPage;
    name:any;email:any;image:any;role:any;user_id:any;
  @ViewChild(Nav) nav: Nav;
    /*
    * 0 => allowed to all
    * 1 => only admin
    * 2 => only parents
    * 3 => only shipper
    * 4 => service providers
    * 5 => daters
    * */
  pages: any[] = [
    { title: 'Dashboard', component: 'CardBackgroundPage', icon: 'home' , allowedTo : [0,1] },
    { title: 'Profile', component: 'ProfilePage', icon: 'person', allowedTo : [0] },
    /*{ title: 'Select Role', component: 'RolePage', icon: 'person', allowedTo : [0,1,2,3,4] },*/
    { title: 'Add Kids', component: 'KidsPage', icon: 'happy', allowedTo : [1,2,7] },
    { title: 'View Kids', component: 'KidsListPage', icon: 'people', allowedTo : [1,2,6,7] },
    /*{ title: 'Select Guardian', component: 'ParentPage', icon: 'contact', allowedTo : [1,2] },*/
    { title: 'New Shipping', component: 'ShippingPage', icon: 'cart', allowedTo : [1,3] },
    { title: 'All Shippings', component: 'AllShippingsPage', icon: 'eye', allowedTo : [1,3,8] },
    /*{ title: 'View Shipping', component: 'ShippingInfoPage', icon: 'eye', allowedTo : [1,3] },*/
    { title: 'New Service', component: 'ShippingPage', icon: 'cog', allowedTo : [1,4] },
    { title: 'All Services', component: 'AllShippingsPage', icon: 'eye', allowedTo : [1,4,9] },
   /*{ title: 'Service Info', component: 'ShippingInfoPage', icon: 'build', allowedTo : [1,4] },*/
    /*{ title: 'Add Receiver', component: 'ReceiverPage', icon: 'briefcase', allowedTo : [1,3] },*/
    { title: 'Dating Profile', component: 'DatingPage', icon: 'calendar', allowedTo : [1,5] },
    { title: 'My Lookouts', component: 'DatingsPage', icon: 'alarm', allowedTo : [1,5,10] },
    /*{ title: 'Dating Info', component: 'DatingInfoPage', icon: 'alarm', allowedTo : [1,5] },*/
    { title: 'My Match', component: 'MatchPage', icon: 'ribbon', allowedTo : [1,5] },
   /* { title: 'Generate QR', component: 'GenerateQrPage', icon: 'barcode', allowedTo : [0] },*/
    { title: 'Scan QR', component: 'ScanQrPage', icon: 'qr-scanner', allowedTo : [0] },
    { title: 'Logout', component: 'LogoutPage', icon: 'exit', allowedTo : [0]  }
  ];


  constructor(private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen
              ,public user: User,public events: Events,
              public toastCtrl: ToastController ,private storage: Storage, public localNotifications: LocalNotifications) {

      let currentDate = new Date();
      let dayDifference = 1 - currentDate.getDay();//On every Monday
      if(dayDifference < 0){
          dayDifference = dayDifference + 7; // for cases where the day is in the following week
      }
      let firstNotificationTime = new Date();
      firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
      firstNotificationTime.setHours(1);
      this.events.subscribe('user:created', (user, time) => {
          // user and time are the same arguments passed in `events.publish(user, time)`
          console.log('Welcome', user, 'at', time);
          this.name = user.full_name;

          this.email = user.email;
          this.user_id = user.id;
          this.image = user.image;
          this.role = user.role_id;

          this.localNotifications.schedule({
              id: 1,
              text: 'Please Update Your Unique Codes! 1',
              at : new Date(new Date().getTime() + 1000),
              led:'FF0000',

          });

          if(cordova)
          {
              cordova.plugins.notification.local.schedule({
                  id: 10,
                  title: 'IDnuts',
                  text: "Please Update Your Unique Codes!",
                  /*at: new Date(new Date().getTime() + 8000),*/
                  foreground: true,
                  trigger: { every: 'month', count: 10 },
                  sound: true,
                  icon:'http://202.142.153.116/uqualify/public/icon.png'
              });
          }
      });

      this.storage.get('user').then((user) => {
          console.log(user);
          if(!user)
          {
              console.log('not logged in');
              this.nav.setRoot('LoginInstagramPage', {}, {
                  animate: true,
                  direction: 'forward'
              });
          }
          else
          {
              this.name = user.full_name;
              this.email = user.email;
              this.user_id = user.id;
              this.image = user.image;
              this.role = user.role_id;
              /*this.localNotifications.schedule({
                  id: 2,
                  text: 'Please Update Your Unique Codes! 2',
                  at : new Date(new Date().getTime() + 1000),
                  led:'FF0000',
                  every:'day'

              });*/
          }
      });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString('#2c4afc');
      this.splashScreen.hide();
    });
    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
      if(page.title == 'Logout')
      {
        this.user.logout();
        console.log('logged out');
        this.nav.setRoot('LoginInstagramPage');
          let toast = this.toastCtrl.create({
              message: 'Logged out!',
              duration: 1500,
              position: 'top'
          });
          toast.present();
      }
      else if(page.title == 'Dashboard')
      {
          this.nav.setRoot(page.component,{user_id:this.user_id,role_id:this.role});
      }
      else if(page.title == 'My Match')
      {
          this.nav.push(page.component,{edit:1,user_id:this.user_id,role_id:this.role});
      }
      else if(page.title == 'All Services' || page.title == 'New Service')
      {
          this.nav.push(page.component,{is_service:1,user_id:this.user_id,role_id:this.role});
      }
      else
      {
          this.nav.push(page.component,{user_id:this.user_id,role_id:this.role});
      }
  }
}
