import { Component } from '@angular/core';
import { NavController, IonicPage ,LoadingController,MenuController,ToastController} from 'ionic-angular';
import { Api } from "../../providers/api/api";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import {Storage} from "@ionic/storage";
import {User} from "../../providers/providers";
@IonicPage()
@Component({
  selector: 'page-card-background',
  templateUrl: 'card-background.html'
})
export class CardBackgroundPage {
  offers:any;
  cards = [
    {
      imageUrl: 'assets/img/card/card-saopaolo.png',
      title: 'Scan QR',
      subtitle: 'Click here to scan QR code',
      page:'ScanQrPage'
    },
    {
      imageUrl: 'assets/img/card/card-amsterdam.png',
      title: 'Profile',
      subtitle: 'Click here to see your profile',
      page:'ProfilePage'
    },
    {
      imageUrl: 'assets/img/card/card-sf.png',
      title: 'Logout',
      subtitle: 'Click here to Logout from app',
      page:'LogoutPage'
    }/*,
    {
      imageUrl: 'assets/img/card/card-madison.png',
      title: 'Books',
      subtitle: 'its dashboard'
    }*/];

  constructor(public storage:Storage ,public user: User,public menu: MenuController,public navCtrl: NavController,public api: Api, public loadingCtrl: LoadingController,public browser: InAppBrowser,public toastCtrl: ToastController) {
      this.menu.enable(true);
  }

  cardTapped(card) {
    console.log(card);
      this.storage.get('user').then((user) => {
        if(card.page == "LogoutPage")
        {
            this.user.logout();
            console.log('logged out');
            this.navCtrl.setRoot('LoginInstagramPage');
            let toast = this.toastCtrl.create({
                message: 'Logged out!',
                duration: 1500,
                position: 'top'
            });
            toast.present();
        }
        else
        {
            this.navCtrl.push(card.page,{user_id:user.id,role_id:user.role_id});
        }
      });

  }

}
