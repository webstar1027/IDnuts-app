import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Api} from "../../providers/api/api";
import {Globals} from "../../app/globals";
import { Storage} from "@ionic/storage";

/**
 * Generated class for the AllShippingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-shippings',
  templateUrl: 'all-shippings.html',
})
export class AllShippingsPage {
    shippings:any = [];
    user:any;
    is_service:any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api,
              public globals:Globals,
              public loadingCtrl:LoadingController,
              public toastCtrl:ToastController,
              public storage:Storage) {

      let loading = this.loadingCtrl.create();
      loading.present();
      this.storage.get('user').then((user) => {
          this.user = user;
      });
let user_id = this.navParams.get('user_id');
    this.is_service = this.navParams.get('is_service');
let role_id = this.navParams.get('role_id');
      let seq = this.api.get('shippings?user_id='+user_id+'&role_id='+role_id).share();

      seq.subscribe((res: any) => {
          loading.dismiss();
          this.shippings = res.data;
          console.log(res);

      }, err => {
          let toast = this.toastCtrl.create({
              duration:1500,
              position:'top',
              message:'An error occurred!'
          });
          toast.present();
          loading.dismiss();
          console.error('ERROR', err);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllShippingsPage');
  }
    viewShipping(shipping)
    {
        this.navCtrl.push('ShippingInfoPage',{shipping:shipping,user_detail:this.user,edit:0});
    }
    addNewUser(type)
    {
        this.navCtrl.push('NewUserPage',{type:type});
    }
}
