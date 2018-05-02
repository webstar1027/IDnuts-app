// import { FormBuilder, FormControl, Validator } from '@angular/forms';
import { Component } from '@angular/core';
import { AlertController, App, LoadingController, IonicPage, NavController, ToastController,MenuController } from 'ionic-angular';
import { User } from '../../providers/providers';
import {MainPage} from "../pages";
import {Storage} from "@ionic/storage";
import { FormBuilder, Validators } from '@angular/forms';
@IonicPage()
@Component({
  selector: 'page-login-instagram',
  templateUrl: 'login-instagram.html',
})
export class LoginInstagramPage {

  public account: any;
  public backgroundImage = 'assets/img/background/background-5.jpg';

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public app: App,
    public user: User,
    public toastCtrl: ToastController
    ,private storage: Storage,
    public formBuilder: FormBuilder,
    public menu: MenuController
  ) {
      this.account = formBuilder.group({
          email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
          password: ['', Validators.compose([Validators.minLength(6),
              Validators.required])]
      });
      this.storage.get('user').then((user) => {
          console.log(user);
          if(user)
          {
              console.log('already logged in');
              this.navCtrl.setRoot(MainPage, {}, {
                  animate: true,
                  direction: 'forward'
              });
          }
      });
  }

    doLogin() {
        if (!this.account.valid) {
            console.log(this.account);
            alert('Invalid or empty data');
        } else {
            /*this.navCtrl.setRoot(MainPage, {}, {
                animate: true,
                direction: 'forward'
            });*/
            const loading = this.loadingCtrl.create();
            loading.present();
            console.log(this.account.value);
            this.user.login(this.account.value).subscribe((resp) => {
                loading.dismissAll();
                this.navCtrl.setRoot(MainPage, {}, {
                    animate: true,
                    direction: 'forward'
                });
                let toast = this.toastCtrl.create({
                    message: 'Logged in!',
                    duration: 1500,
                    position: 'top'
                });
                toast.present();
            }, (err) => {
                loading.dismissAll();
                //this.navCtrl.push(MainPage);
                // Unable to log in
                let toast = this.toastCtrl.create({
                    message: 'Unable to sign in. Please check your account information and try again.',
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            });
        }
  }

  goToSignup() {
    this.navCtrl.push('RolePage');
  }

  goToRecovery() {
    this.navCtrl.push('ForgetPage');
  }

    ionViewDidEnter() {
        // the root left menu should be disabled on the sign in page
        this.menu.enable(false);
    }

    ionViewWillLeave() {
        // enable the root left menu when leaving the sign in page
        this.menu.enable(true);
    }
}
