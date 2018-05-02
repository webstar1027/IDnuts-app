import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Api} from "../../providers/api/api";
import {Globals} from "../../app/globals";
import {Storage} from "@ionic/storage";
import {SelectSearchable} from "../components/select/select";
import {CallNumber} from "@ionic-native/call-number";

/**
 * Generated class for the MatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})
export class MatchPage {
    lookouts:any = [];
    daters:any = [];
    lookout_id:any;
    user:any;
    dating_date:any;
    dating:any;
    dater:any;
    dater_ids:any;
    phone:any;
    unique_array:any;
    unique_code:any;
    edit:any;
    createdCode:any;
    code_generated:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public api:Api,
              public loadingCtrl:LoadingController,
              public globals:Globals,
              public toastCtrl:ToastController,
              public storage:Storage,private callNumber: CallNumber)
  {

      this.edit = this.navParams.get('edit');
      this.dating = this.navParams.get('dating');
      if(this.dating)
      {
          if(this.dating.unique_code)
          {
              this.unique_code = this.dating.unique_code;
              this.unique_array = this.unique_code.split('');
              this.code_generated = 1;
          }
          this.phone = this.dating.phone;
          this.dating_date = this.dating.date.slice(0,-9);
          console.log(this.dating_date);
          this.createdCode = this.globals.encrypt(JSON.stringify(this.dating));
          //this.lookout_id = this.dating.lookout_id;
      }

      this.storage.get('dater').then((dater) => {
          this.dater = dater;
      });

      this.storage.get('user').then((user) => {

          this.user = user;

          /*let req = this.api.get('lookouts/'+this.user.id+'/'+this.user.role_id).share();
          let loading = this.loadingCtrl.create();
          req.subscribe(data =>{
              loading.dismissAll();
              this.lookouts = data['data'];
              if(this.dating)
              {
                  if(this.dating.lookout_id)
                  {
                      this.dating.lookout_id += '';
                      this.lookout_id = this.dating.lookout_id.split(',');
                      let selectedGuards = [];
                      let count = 0;
                      for (let g of this.lookout_id)
                      {
                          selectedGuards[count] = this.lookouts[this.lookouts.findIndex(item => item.id == g)];
                          count++;
                      }
                      this.lookout_id = selectedGuards;
                      console.log(this.lookout_id)
                  }
              }
              console.log(data);
          },err => {
              loading.dismissAll();
              console.log(err);
          })*/
      });
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchPage');
  }
    addNewUser(type)
    {
        this.navCtrl.push('NewUserPage',{type:type});
    }
    call()
    {
        console.log(this.dating);
        this.callNumber.callNumber(this.dating.phone, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
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

    notifyLookout()
    {
        let loading = this.loadingCtrl.create();
        loading.present();
        let data :any = {};
        data.user_id = this.user.id;
        data.dating_date = this.dating_date;
        data.dater_name = this.user.full_name;
        data.unique_code = this.unique_code;
        data.phone = this.phone;

        let column = '';
        let selectedLookoutEmails = [];
        let selectedLookoutIds = [];
        let counter = 0;
        for(let lookout_id of this.lookout_id)
        {
            column = lookout_id;
            if(lookout_id && lookout_id.id)
            {
                column = lookout_id.id;
                selectedLookoutEmails.push( lookout_id.email) ;
            }
            selectedLookoutIds[counter] = column;
            counter++;

        }

        data.lookout_id = selectedLookoutIds.join();
        data.lookout_email = selectedLookoutEmails.join();
        let dating_id = 0;
        if(this.dating && this.dating.id)
        {
            dating_id = this.dating.id;
        }
        data.dating_id = dating_id;
        let column2 = this.dater_ids;
        if(this.dater_ids && this.dater_ids.id)
        {
            column2 = this.dater_ids.id;
        }
        data.dater_id = column2;
        let selectedDater = this.daters[this.daters.findIndex(item => item.id == column2)];
        data.dater_email = selectedDater.email;
        data.dating_with_name = selectedDater.full_name;
        console.log(data);
        let req = this.api.post('assign/lookout',data).share();
        req.subscribe(data =>{
            loading.dismissAll();
            console.log(data);
            let msg = this.toastCtrl.create({
                message: 'Lookout Notified!',
                duration: 1500,
                position: 'top'
            });
            msg.present();
            this.navCtrl.push('DatingsPage',{user_id:this.user.id,role_id:this.user.role_id});
        },err => {
            loading.dismissAll();
            alert('Something whent wrong!')
            console.log(err);
        });
    }
    onSelect(event: { component: SelectSearchable, value: any }){
        console.log(event.value);
        console.log(this.lookout_id);

        if(this.lookout_id.length > 3){
            let dummy = 3 - this.lookout_id.length;
            this.lookout_id = this.lookout_id.slice(0,dummy);
            console.log(this.lookout_id);
            alert('You can only select upto 3 Lookouts');
        }
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
        let req = this.api.get('lookouts/'+this.user.id+'/'+this.user.role_id+'/'+text).share();
        req.subscribe(data =>{
            //loading.dismissAll();

            this.lookouts = data['data'];

            event.component.items = data['data'];
            event.component.isSearching = false;
            /*if(this.shipping)
            {
                if(this.shipping.receiver_id)
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
                }
            }*/
            console.log(data);
        },err => {
            //loading.dismissAll();
            console.log(err);
        })
    }


    searchDaters(event: { component: SelectSearchable, text: string }) {
        let text = (event.text || '').trim().toLowerCase();

        if (!text) {
            event.component.items = [];
            return;
        } else if (event.text.length < 3) {
            return;
        }
        let type:any = event.component.data_type;
        event.component.isSearching = true;

        let req = this.api.get('daters/'+this.user.id+'/'+this.user.role_id+'/'+text).share();
        req.subscribe(data =>{

            this.daters = data['data'];

            event.component.items = data['data'];
            event.component.isSearching = false;

            console.log(data);
        },err => {
            console.log(err);
        })
    }
}
