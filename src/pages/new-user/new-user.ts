import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, Validators} from "@angular/forms";
import {Api} from "../../providers/api/api";
import {Storage} from "@ionic/storage";
import {Globals} from "../../app/globals";

/**
 * Generated class for the NewUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-user',
  templateUrl: 'new-user.html',
})
export class NewUserPage {
user:any;
type : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public formBuilder: FormBuilder,
              public api:Api,private storage:Storage,
              public loadingCtrl:LoadingController,
              public globals:Globals,
              public toastCtrl:ToastController
  ) {
      this.type = this.navParams.get('type');
      this.user = formBuilder.group({
          email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewUserPage');
  }
    sendEmail()
    {
      if(!this.user.valid || !this.user.value.email)
      {
        console.log(this.user);
      }
      else {
        console.log('valid email');
          let loading = this.loadingCtrl.create();
          loading.present();

          this.storage.get('user').then(user =>{
              let data = {
                  'email':this.user.value.email,
                  'user_name':user.full_name,
                  'user_id':user.id,
                  'title':'IDnuts Invitation for '+this.globals.roles[this.type],
                  'refferal_link':user.shareAble,
                  'role_id':this.type
              };
              console.log(data);
              let req = this.api.post('new/user/email',data).share();
              req.subscribe(data =>{
                  loading.dismissAll();
                 let toast =  this.toastCtrl.create({
                     duration:1500,
                     position:'top',
                     message:'New user invited successfully!'
                 });
                 toast.present();
                  console.log(data);
              },err => {
                  loading.dismissAll();
                  let toast =  this.toastCtrl.create({
                      duration:1500,
                      position:'top',
                      message:'An error occurred!'
                  });
                  toast.present();
                  console.log(err);
              })
          });
      }
    }

}
