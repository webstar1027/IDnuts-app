import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { Globals } from "../../app/globals";
import {Api} from "../../providers/api/api";
import { CallNumber } from '@ionic-native/call-number';
/**
 * Generated class for the KidsInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kids-info',
  templateUrl: 'kids-info.html',
})
export class KidsInfoPage {
kid:any;
user:any;
    guardians:any;
    edit= 0;
    createdCode = null;
    unique_array:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public globals:Globals,
              public loadingCtrl:LoadingController,
              public toastCtrl:ToastController,
              public api:Api,private callNumber: CallNumber
  ) {
    this.kid = this.navParams.get('kid');
    this.guardians = this.navParams.get('guardians');
    this.user = this.navParams.get('user_detail');
    this.edit = this.navParams.get('edit');
    if(this.kid.unique_code)
    {
        this.unique_array = this.kid.unique_code.split('');
    }
    this.kid.teacher_image = '';

    if(this.kid.guardians)
    {
        let custom_guardians = [];
        let count = 0;
        for(let guard of this.kid.guardians)
        {
            let g:any = {};
            g.id = guard.id;
            g.full_name = guard.full_name;
            g.email = guard.email;
            custom_guardians[count] = g;
            count++;
        }
        this.kid.guardians = custom_guardians;
    }
      this.createdCode = this.globals.encrypt(JSON.stringify(this.kid));

      /*let item = this.globals.decrypt(this.createdCode);
      console.log(item);
      console.log(JSON.parse(item));*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KidsInfoPage');
  }
    assign()
    {
      this.navCtrl.push('ParentPage',{kid:this.kid});
    }
    notify()
    {
        let loading = this.loadingCtrl.create();
        loading.present();

        let req = this.api.post('notify/guardian',this.kid).share();
        req.subscribe(data =>{
            loading.dismissAll();
            console.log(data);
            let msg = this.toastCtrl.create({
                message: 'Teacher/Guardian Notified!',
                duration: 1500,
                position: 'top'
            });
            msg.present();
        },err => {
            loading.dismissAll();
            console.log(err);
        });
    }
    deleteKid()
    {
        if(confirm("Are you sure to delete this kid!")){
            let loading = this.loadingCtrl.create();
            loading.present();

            let req = this.api.post('delete/kid',this.kid).share();
            req.subscribe(data =>{
                loading.dismissAll();
                console.log(data);
                let msg = this.toastCtrl.create({
                    message: 'Kid Deleted!',
                    duration: 1500,
                    position: 'top'
                });
                msg.present();
                this.navCtrl.push('KidsListPage');
            },err => {
                loading.dismissAll();
                console.log(err);
            });
        }
    }
    call()
    {
        console.log(this.kid);
        this.callNumber.callNumber(this.kid.phone, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
    }
}
