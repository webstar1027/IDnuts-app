import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Globals} from "../../app/globals";
import {CallNumber} from "@ionic-native/call-number";
import {Api} from "../../providers/api/api";

/**
 * Generated class for the ShippingInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shipping-info',
  templateUrl: 'shipping-info.html',
})
export class ShippingInfoPage {
    shipping:any;
    user:any;
    edit= 0;
    createdCode = null;
    scannedCode = null;
    generated = null;
    unique_array:any;
  constructor(public loadingCtrl:LoadingController,public api:Api,public navCtrl: NavController, public navParams: NavParams,public globals:Globals,private callNumber: CallNumber) {
      this.shipping = this.navParams.get('shipping');
      this.user = this.navParams.get('user_detail');
      this.edit = this.navParams.get('edit');
      if(this.shipping)
      {
          if(this.shipping.unique_code)
          {
              this.unique_array = this.shipping.unique_code.split('');
          }
          this.createdCode = this.globals.encrypt(JSON.stringify(this.shipping));
      }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShippingInfoPage');
  }
    assign()
    {
        this.navCtrl.push('ReceiverPage',{shipping:this.shipping,role_id:this.user.role_id});
    }
    call()
    {
        console.log(this.shipping);
        this.callNumber.callNumber(this.shipping.phone, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
    }
    deleteMe()
    {
        let loading = this.loadingCtrl.create();
        loading.present();
        let seq = this.api.post('shippings/delete', {shipping_id:this.shipping.id}).share();

        seq.subscribe((res: any) => {
            loading.dismiss();
            alert('Deleted Successfully!');
            this.navCtrl.push('AllShippingsPage',{role_id:this.user.role_id,user_id:this.user.id});
            console.log(res);

        }, err => {
            alert('An error occurred!');
            loading.dismiss();
            console.error('ERROR', err);
        });
    }
}
