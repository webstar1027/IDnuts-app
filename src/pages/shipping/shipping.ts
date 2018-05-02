import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Api } from "../../providers/api/api";
import { Globals } from "../../app/globals";

/**
 * Generated class for the ShippingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shipping',
  templateUrl: 'shipping.html',
})
export class ShippingPage {
    shipping:any;
    is_service = 0;
    role_id:any;
    user_id:any;
  constructor( public formBuilder: FormBuilder,public navCtrl: NavController, public navParams: NavParams,public api:Api,
               public globals:Globals,
               public loadingCtrl:LoadingController,
               public toastCtrl:ToastController
  ) {
      this.role_id = this.navParams.get('role_id');
      this.user_id = this.navParams.get('user_id');
      this.is_service = this.navParams.get('is_service');
      this.shipping = formBuilder.group({
          company: ['', Validators.required],
          location: ['', Validators.required],
          product_type:['', Validators.required],
          shipping_date:['', Validators.required],
          ship_by:['']
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShippingPage');
  }
    newShipping()
    {
        if (!this.shipping.valid) {
            console.log(this.shipping);
            alert('Invalid or empty data');
        } else {
          let loading = this.loadingCtrl.create();
          loading.present();
          console.log(this.shipping.value);
          this.shipping.value.user_id = this.user_id;
          this.shipping.value.is_service = this.is_service;
            let seq = this.api.post('shippings', this.shipping.value).share();

            seq.subscribe((res: any) => {
                loading.dismiss();
                let toast = this.toastCtrl.create({
                    duration:1500,
                    position:'top',
                    message:'New Shipping Details added!'
                });
                toast.present();
                this.navCtrl.push('ReceiverPage',{shipping:res.data,role_id:this.role_id});
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

    }
    clearAll()
    {
        console.log('clearing');
        this.shipping.reset();
    }

}
