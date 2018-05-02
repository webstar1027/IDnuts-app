import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, Validators} from "@angular/forms";
import {Api} from "../../providers/api/api";
import {Storage} from "@ionic/storage";
/**
 * Generated class for the DatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dating',
  templateUrl: 'dating.html',
})
export class DatingPage {
dater:any;
is_edit:boolean = false;
  constructor(public toastCtrl: ToastController,public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder,public api: Api,private storage: Storage) {
      this.dater = formBuilder.group({
          interests:['', Validators.required],
          qualification:['', Validators.required],
          work:['', Validators.required],
          instagram_id:['', Validators.required],
          info:['', Validators.required],
      });
      this.storage.get('dater').then((dater)=>{
          console.log(dater);
          if(dater)
          {
              //this.dater = dater;
              this.is_edit = true;

              this.dater = formBuilder.group({
              interests:[dater.interests, Validators.required],
              qualification:[dater.qualification, Validators.required],
              work:[dater.work, Validators.required],
              instagram_id:[dater.instagram_id, Validators.required],
              info:[dater.info, Validators.required],
          });
          }

      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DatingPage');
  }
    addDater()
    {
        if (!this.dater.valid) {
            console.log(this.dater);
            alert('Invalid or empty data');
        } else {
            const loading = this.loadingCtrl.create();
            loading.present();
            this.storage.get('user').then((user) => {
                console.log(user);
                if(user)
                {
                    let data = this.dater.value;
                    data.user_id = user.id;
                    data.role_id = user.role_id;
                    let seq = this.api.post('add/dater', data).share();

                    seq.subscribe((res: any) => {
                        loading.dismissAll();
                        // If the API returned a successful response
                        if (res.success) {
                            console.log('**Dater added**');
                            this.storage.set('dater',res['data']);
                            console.log(res);
                            this.navCtrl.setRoot('MatchPage', {dater:res['data']}, {
                                animate: true,
                                direction: 'forward'
                            });
                            let toast = this.toastCtrl.create({
                                message: '**Dater Added**',
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
        this.dater.reset();
    }
}
