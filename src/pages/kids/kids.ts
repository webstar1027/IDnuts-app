import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, Validators} from "@angular/forms";
import {Api} from "../../providers/api/api";
import {Storage} from "@ionic/storage";
/**
 * Generated class for the KidsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kids',
  templateUrl: 'kids.html',
})
export class KidsPage {
kid:any;
  constructor(public toastCtrl: ToastController,public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder,public api: Api,private storage: Storage,) {
      this.kid = formBuilder.group({
          name:['', Validators.required],
          school:['', Validators.required],
          class:['', Validators.required],
          time_in:['', Validators.required],
          time_out:['', Validators.required],
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KidsPage');
  }
    addKid()
    {
        if (!this.kid.valid) {
            console.log(this.kid);
            alert('Invalid or empty data');
        } else {
            const loading = this.loadingCtrl.create();
            loading.present();
          this.storage.get('user').then((user) => {
              console.log(user);
              if(user)
              {
                  let data = this.kid.value;
                  data.user_id = user.id;
                  data.role_id = user.role_id;
                  let seq = this.api.post('add/kid', data).share();

                  seq.subscribe((res: any) => {
                      loading.dismissAll();
                      // If the API returned a successful response, mark the user as logged in
                      if (res.success) {
                          console.log('**Kid added**');
                          console.log(res);
                          this.navCtrl.setRoot('ParentPage', {kid:res['data']}, {
                              animate: true,
                              direction: 'forward'
                          });
                          let toast = this.toastCtrl.create({
                              message: '**Kid Added**',
                              duration: 1500,
                              position: 'top'
                          });
                          toast.present();
                      } else {
                      }
                  }, err => {
                      loading.dismissAll();
                      let toast = this.toastCtrl.create({
                          message: 'An error occurred',
                          duration: 1500,
                          position: 'top'
                      });
                      toast.present();
                      console.error('ERROR', err);
                  });
              }
          });
        }
    }
    clearAll()
    {
        console.log('clearing');
        this.kid.reset();
    }
}
