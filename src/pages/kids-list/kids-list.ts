import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Api} from "../../providers/api/api";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the KidsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kids-list',
  templateUrl: 'kids-list.html',
})
export class KidsListPage {
    kids:any = [];
    user:any;

    constructor(public toastCtrl:ToastController,public navCtrl: NavController, public navParams: NavParams,public api:Api,private storage: Storage,public loadingCtrl:LoadingController) {
      const loading = this.loadingCtrl.create();
      loading.present();
    this.storage.get('user').then(user =>{
        console.log(user);
        this.user = user;
        let req = this.api.post('my/kids',{id:user.id, role_id:user.role_id}).share();
        req.subscribe(data => {
            loading.dismissAll();
            this.kids = data['data'];

        }, err=>{
            let msg = this.toastCtrl.create({
                message: 'An Error Occurred',
                duration: 1500,
                position: 'top'
            });
            msg.present();
            loading.dismissAll();
            console.log(err);
        })
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KidsListPage');
  }
  viewKid(kid)
  {
    this.navCtrl.push('KidsInfoPage',{kid:kid,guardians:kid.guardians,user_detail:this.user,edit:0});
  }
    addNewUser(type)
    {
        this.navCtrl.push('NewUserPage',{type:type});
    }
}
