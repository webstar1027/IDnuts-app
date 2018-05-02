import { Component } from '@angular/core';
import {IonicPage, LoadingController, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import {User} from "../../providers/providers";
/**
 * Generated class for the ForgetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})
export class ForgetPage {
    public account: any;
  constructor(public loadingCtrl: LoadingController,public toastCtrl: ToastController,public navCtrl: NavController,public user: User, public navParams: NavParams,public formBuilder: FormBuilder,public menu: MenuController) {
      this.account = formBuilder.group({
          email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPage');
  }
    ionViewDidEnter() {
        // the root left menu should be disabled on the sign in page
        this.menu.enable(false);
    }

    recover()
    {
        if (!this.account.valid) {
            console.log(this.account);
            console.log('Invalid or empty data');
        } else {
            const loading = this.loadingCtrl.create();
            console.log(this.account.value);
            let data = this.account.value;
            data.from_mobile = 1;
            this.user.recover(data).subscribe((resp) => {
                loading.dismissAll();
                this.navCtrl.setRoot('LoginInstagramPage', {}, {
                    animate: true,
                    direction: 'forward'
                });
                let toast = this.toastCtrl.create({
                    message: 'A recovery email has been sent at your email',
                    duration: 1500,
                    position: 'top'
                });
                toast.present();
            }, (err) => {
                loading.dismissAll();
                let toast = this.toastCtrl.create({
                    message: 'Some thing went wrong. please try again!',
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            });
        }
    }
}
