import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    IonicPage, NavController, LoadingController, ToastController, MenuController, Platform,
    ActionSheetController,NavParams
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { CameraProvider } from '../../providers/util/camera.provider';
import { FormBuilder, Validators } from '@angular/forms';
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: any;
    chosenPicture: any;
  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,public navParams: NavParams,
    public user: User,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public menu: MenuController,
    public translateService: TranslateService,
    public formBuilder: FormBuilder,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public cameraProvider: CameraProvider,
    private storage: Storage) {
      console.log('Selected Role = '+ this.navParams.get('a'));
      this.account = formBuilder.group({
          email: ['', Validators.email],
          password: ['', Validators.compose([Validators.minLength(6),
              Validators.required])],
          full_name:['', Validators.required],
          dob:['', Validators.required],
          /*phone:['', Validators.required],*/
          password_confirmation:['', Validators.compose([Validators.minLength(6),
              Validators.required])],
          gender:[''],
      });
      this.storage.get('user').then((user) => {
          console.log(user);
          if(user)
          {
              console.log('already logged in');
              this.navCtrl.setRoot(MainPage, {}, {
                  animate: true,
                  direction: 'forward'
              });
          }
      });
    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
      if (!this.account.valid) {
          console.log(this.account);
          alert('Invalid or empty data');
      } else {
          console.log(this.account.value);
          const loading = this.loadingCtrl.create();
          loading.present();
          // Attempt to login in through our User service
          this.account.value.image = this.chosenPicture;
          this.account.value.role_id = this.navParams.get('a');
          this.user.signup(this.account.value).subscribe((resp) => {
              console.log(resp);

              loading.dismissAll();
              this.navCtrl.setRoot(MainPage, {}, {
                  animate: true,
                  direction: 'forward'
              });
              let toast = this.toastCtrl.create({
                  message: 'Congrats, you are registered!',
                  duration: 1500,
                  position: 'top'
              });
              toast.present();
          }, (err) => {
              let error = this.signupErrorString;
              if(err.error.message)
              {
                  if (typeof err.error.message.email !== 'undefined') {
                      error = err.error.message.email[0];
                  }
                  else if (typeof err.error.message.password !== 'undefined') {
                      error = err.error.message.password[0];
                  }
                  else if (typeof err.error.message.name !== 'undefined') {
                      error = err.error.message.name[0];
                  }
              }
              loading.dismissAll();
              //this.navCtrl.push(MainPage);

              // Unable to sign up
              let toast = this.toastCtrl.create({
                  message: error,
                  duration: 3000,
                  position: 'top'
              });
              toast.present();
          });
      }
  }

    ionViewDidEnter() {
        // the root left menu should be disabled on the sign up page
        this.menu.enable(false);
    }

    ionViewWillLeave() {
        // enable the root left menu when leaving the sign up page
        this.menu.enable(true);
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
}
