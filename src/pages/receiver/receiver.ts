import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Api} from "../../providers/api/api";
import {Globals} from "../../app/globals";
import {Storage} from "@ionic/storage";
import {SelectSearchable} from "../components/select/select";
/**
 * Generated class for the ReceiverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receiver',
  templateUrl: 'receiver.html',
})
export class ReceiverPage {
    receivers:any = [];
    receiver:any;
    user:any;
    shipping:any;
    unique_array:any;
    unique_code:'';
    code_generated:any;
    role_id:any;
    phone:any;
    receiver_role = 8;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api,
              public loadingCtrl:LoadingController,
              public globals:Globals,
              public toastCtrl:ToastController,
              public storage:Storage
  ) {
      this.storage.get('user').then((user) => {
          this.user = user;
      });
      this.shipping = this.navParams.get('shipping');
      this.role_id = this.navParams.get('role_id');

      if(this.role_id == 4)
      {
          this.receiver_role = 9;
      }
      if(this.shipping) {
          this.phone = this.shipping.phone;
          if (this.shipping.unique_code) {
              this.unique_code = this.shipping.unique_code;
              this.unique_array = this.unique_code.split('');
              this.code_generated = 1;
          }
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiverPage');
  }
    addNewUser(type)
    {
        this.navCtrl.push('NewUserPage',{type:type});
    }

    generateUniqueCode()
    {
        let loading = this.loadingCtrl.create();
        loading.present();
        let req = this.api.get('unique/code').share();
        req.subscribe(data =>{
            loading.dismissAll();
            this.unique_code = data['data'];
            this.code_generated = 1;
            this.unique_array = this.unique_code.split('');
            console.log(data);
        },err => {
            loading.dismissAll();
            console.log(err);
        });
    }

    notifyReceiver()
    {
        let loading = this.loadingCtrl.create();
        loading.present();
        let data :any = {};
        data.shipping = this.shipping.id;
        data.product = this.shipping.product_type;
        data.company = this.shipping.company;
        data.user_id = this.shipping.user_id;
        data.date = this.shipping.shipping_date;
        data.unique_code = this.unique_code;
        data.phone = this.phone;

        data.receiver_role = this.receiver_role;
        console.log(this.receiver);

        let column = '';
        let selectedReceiverEmails = [];
        let selectedReceiverIds = [];
        let counter = 0;
        for(let receiver of this.receiver)
        {
            column = receiver;
            if(receiver && receiver.id)
            {
                column = receiver.id;
                selectedReceiverEmails.push( receiver.email) ;
            }
            selectedReceiverIds[counter] = column;
            counter++;
        }

        data.receiver_id = selectedReceiverIds.join();

        data.receiver_email = selectedReceiverEmails.join();




        /*if(this.receiver && this.receiver.id)
        {
            column = this.receiver.id;
        }
        data.receiver_id = column;

        let selectedReceiver = this.receivers[this.receivers.findIndex(item => item.id == column)];
        data.receiver_email = selectedReceiver.email;*/
        console.log(data);
        let req = this.api.post('assign/receiver',data).share();
        req.subscribe(data =>{
            loading.dismissAll();
            console.log(data);
            let msg = this.toastCtrl.create({
                message: 'Receiver Notified!',
                duration: 1500,
                position: 'top'
            });
            msg.present();
            this.navCtrl.push('AllShippingsPage',{user_id:this.user.id,role_id:this.user.role_id});
        },err => {
            loading.dismissAll();
            console.log(err);
        });
    }
    searchGuards(event: { component: SelectSearchable, text: string }) {
        let text = (event.text || '').trim().toLowerCase();

        if (!text) {
            event.component.items = [];
            return;
        } else if (event.text.length < 3) {
            return;
        }
        let type:any = event.component.data_type;
        event.component.isSearching = true;
        /* let loading = this.loadingCtrl.create();
         loading.present();*/
        let req = this.api.get('receivers/'+this.receiver_role+'/'+text).share();
        req.subscribe(data =>{
            //loading.dismissAll();

            this.receivers = data['data'];

            event.component.items = data['data'];
            event.component.isSearching = false;
            if(this.shipping)
            {
                /*if(this.shipping.receiver_id)
                {
                    this.shipping.receiver_id += '';
                    this.receiver = this.shipping.receiver_id.split(',');
                    let selectedGuards = [];
                    let count = 0;
                    for (let g of this.receiver)
                    {
                        selectedGuards[count] = this.receivers[this.receivers.findIndex(item => item.id == g)];
                        count++;
                    }
                    this.receiver = selectedGuards;
                    console.log(this.receiver)
                }*/
            }
            console.log(data);
        },err => {
            //loading.dismissAll();
            console.log(err);
        })
    }

    onSelect(event: { component: SelectSearchable, value: any }){
        console.log(event.value);
        console.log(this.receiver);

        if(this.receiver.length > 3){
            let dummy = 3 - this.receiver.length;
            this.receiver = this.receiver.slice(0,dummy);
            console.log(this.receiver);
            alert('You can only select upto 3 Receivers');
        }
    }
}
