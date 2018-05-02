import { Component } from '@angular/core';
import {
    IonicPage, NavController, NavParams, Platform, ActionSheetController, LoadingController,
    ToastController, Events
} from 'ionic-angular';
import { CameraProvider } from '../../providers/util/camera.provider';
import {Storage} from "@ionic/storage";
import { SocialSharing } from '@ionic-native/social-sharing';
import {Api} from "../../providers/api/api";
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
    user:any = {};
    genders = {0:'Other',1:'Male',2:'Female'};
    chosenPicture: any;
  constructor(public navCtrl: NavController, public navParams: NavParams  ,private socialSharing: SocialSharing,
              public platform: Platform, public actionsheetCtrl: ActionSheetController,
              public loadingCtrl: LoadingController,
              public cameraProvider: CameraProvider,
              private storage: Storage,
              public api:Api,
              public toastCtrl:ToastController,public events: Events
  ) {
  this.storage.get('user').then((val) => {
      if(val)
      {
          this.user = val;
          this.chosenPicture = this.user.image;
          if(this.user.dob && this.user.dob.length == 19)
          {
              this.user.dob = this.user.dob.slice(0,-9);
          }
      }
      else
      {
          this.navCtrl.setRoot('LoginInstagramPage');
      }
      console.log(val);
      console.log(this.genders);
  });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
    changePicture() {

        const actionsheet = this.actionsheetCtrl.create({
            title: 'upload picture',
            buttons: [
                {
                    text: 'camera',
                    icon: !this.platform.is('ios') ? 'camera' : null,
                    handler: () => {
                        this.takePicture();
                    }
                },
                {
                    text: !this.platform.is('ios') ? 'gallery' : 'camera roll',
                    icon: !this.platform.is('ios') ? 'image' : null,
                    handler: () => {
                        this.getPicture();
                    }
                },
                {
                    text: 'cancel',
                    icon: !this.platform.is('ios') ? 'close' : null,
                    role: 'destructive',
                    handler: () => {
                        console.log('the user has cancelled the interaction.');
                    }
                }
            ]
        });
        return actionsheet.present();
    }

    takePicture() {
        const loading = this.loadingCtrl.create();

        loading.present();
        return this.cameraProvider.getPictureFromCamera().then(picture => {
            if (picture) {
                this.chosenPicture = picture;
            }
            loading.dismiss();
        }, error => {
            alert(error);
        });
    }

    getPicture() {
        const loading = this.loadingCtrl.create();

        loading.present();
        return this.cameraProvider.getPictureFromPhotoLibrary().then(picture => {
            if (picture) {
                this.chosenPicture = picture;
            }
            loading.dismiss();
        }, error => {
            alert(error);
        });
    }
    doUpdate()
    {
        let loading = this.loadingCtrl.create();
        loading.present();
        if(this.chosenPicture)
        {
            this.user.image = this.chosenPicture;
        }
        let req = this.api.post('update/profile',{user:this.user}).share();
        req.subscribe((data)=>{
            this.storage.set('user',data['data']);
            this.events.publish('user:created', data['data'], Date.now());
            loading.dismissAll();
            let toast = this.toastCtrl.create({
                duration:1500,
                position:'top',
                message:'Profile Updated!'

            });
            toast.present();
            console.log(data);
        },error=>{
            console.log(error);
            loading.dismissAll();
            alert("An error Occurred");
        });
        console.log(this.user);
    }
    shareReferralLink(shareAble)
    {
        this.socialSharing.share('I am Earning in this affiliate network! you should try it too!' ,'','',shareAble);
    }
}
