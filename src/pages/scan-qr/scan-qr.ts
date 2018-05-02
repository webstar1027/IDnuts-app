import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Globals } from "../../app/globals";
import {Api} from "../../providers/api/api";
import {Storage} from "@ionic/storage";
/**
 * Generated class for the ScanQrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan-qr',
  templateUrl: 'scan-qr.html',
})
export class ScanQrPage {
    barcodeData : any;
    user:any;
  constructor(public storage:Storage,public loadingCtrl:LoadingController,public api:Api,public navCtrl: NavController,public globals:Globals, public navParams: NavParams,public barcodeScanner : BarcodeScanner, public alertCtrl: AlertController) {
      this.storage.get('user').then((user) => {
          this.user = user;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanQrPage');
  }
    scan() {
        const options = {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            prompt: 'Place a barcode inside the scan area', // Android
            // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            resultDisplayDuration: 500,
            formats: 'QR_CODE,PDF_417', // default: all but PDF_417 and RSS_EXPANDED
            // Android only (portrait|landscape), default unset so it rotates with the device
            orientation: 'portrait',
            disableAnimations: true, // iOS
            disableSuccessBeep: false // iOS
        };

        this.barcodeScanner
            .scan(options)
            .then((data) => {
                console.log(data);
                this.barcodeData = data.text;
                let scaned_user = this.globals.decrypt(this.barcodeData);
                scaned_user = JSON.parse(scaned_user);
                console.log(scaned_user);
                console.log(this.user);

                if(this.user.role_id == 2 || this.user.role_id == 1)
                {
                    this.check(scaned_user,'user_id','KidsInfoPage');
                }
                else if(this.user.role_id == 5)
                {
                    this.check(scaned_user,'user_id','MatchPage');
                }
                else if(this.user.role_id == 10)
                {
                    this.check(scaned_user,'lookout_id','MatchPage');
                }
                else if(this.user.role_id == 6)
                {
                    this.check(scaned_user,'guardian_id','KidsInfoPage');
                }
                else if(this.user.role_id == 7)
                {
                    if(scaned_user['user_id'] == this.user.id || scaned_user['teacher_id'] == this.user.id)
                    {
                        let loading = this.loadingCtrl.create();
                        loading.present();
                        let req = this.api.post('notify/user',{current_user:this.user,scanned_data:scaned_user}).share();
                        req.subscribe(data =>{
                            console.log(data);
                            loading.dismissAll();
                            alert(data['data']);
                            this.navCtrl.push('KidsInfoPage',{kid:scaned_user,user_detail:this.user,edit:1});

                        },err => {
                            loading.dismissAll();
                            let msg = this.alertCtrl.create({
                                title: 'Attention!',
                                subTitle: 'An error occurred while notifying user!',
                                buttons: ['Close']
                            });
                            msg.present();
                            console.log(err);
                        });

                    }
                    else
                    {
                        alert('Access Denied!');
                    }
                }
                else if(this.user.role_id == 8 || this.user.role_id == 9)
                {
                    this.check(scaned_user,'receiver_id','ShippingInfoPage');
                }
                else if(this.user.role_id == 3 || this.user.role_id == 4)
                {
                    this.check(scaned_user,'user_id','ShippingInfoPage');
                }
                else
                {
                    alert('Access Denied!');
                }
            })
            .catch((err) => {
                /*const alert = this.alertCtrl.create({
                    title: 'Attention!',
                    subTitle: err,
                    buttons: ['Close']
                });
                alert.present();*/
                console.log(err);
            });
    }

    check(scaned_user,field,page)
    {
        if(scaned_user[field] == this.user.id)
        {
            let loading = this.loadingCtrl.create();
            loading.present();
            let req = this.api.post('notify/user',{current_user:this.user,scanned_data:scaned_user}).share();
            req.subscribe(data =>{
                console.log(data);
                loading.dismissAll();
                alert(data['data']);
                this.navCtrl.push(page,{kid:scaned_user,dating:scaned_user,shipping:scaned_user,user_detail:this.user,edit:1});

            },err => {
                loading.dismissAll();
                let msg = this.alertCtrl.create({
                    title: 'Attention!',
                    subTitle: 'An error occurred while notifying user!',
                    buttons: ['Close']
                });
                msg.present();
                console.log(err);
            });

        }
        else
        {
            alert('Access Denied!');
        }
    }
    goBack()
    {
        this.navCtrl.pop();
    }
}
