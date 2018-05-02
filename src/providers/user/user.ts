import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import {Events} from 'ionic-angular';
import { Api } from '../api/api';
import { Storage } from '@ionic/storage';
/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public api: Api,private storage: Storage,public events: Events) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    console.log('Logging In...');
    console.log(accountInfo);
    let seq = this.api.post('login', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.success) {
          console.log('**Logged In**');
        this._loggedIn(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
        console.log(res);
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success' || res.success == true) {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  recover(email:any)
  {
      let seq = this.api.post('recover', email).share();

      seq.subscribe((res: any) => {
          console.log('Success ');
          console.log(res);

          if (res.message == 'OK') {
              console.log('Email Sent');
          }
      }, err => {
          console.error('ERROR', err);
      });

      return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
    this.storage.set('user',null);
    console.log('logging out....');
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
      console.log(resp);
    this._user = resp.data;
    let url = this.generateUniqueId();
    console.log(url);
      this._user.shareAble = url;
      if(!this._user.image)
      {
          this._user.image = 'assets/img/avatar/avatar.jpg';
      }
      this.storage.set('user',this._user);
      this.events.publish('user:created', this._user, Date.now());
    console.log(this._user);
  }

  generateUniqueId()
  {
      let randomNumber = this.generateRandomString();
      let randomNumber2 = this.generateRandomString();
      let uniqueID = randomNumber + this._user.id + randomNumber2;
      return 'http://202.142.153.116/uqualify/public/share/'+uniqueID;
  }

    generateRandomString() {
        let $length = 5;
        let $characters = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let $charactersLength = $characters.length;
        let $randomString = '';
        for (let $i = 0; $i < $length; $i++) {
            $randomString += $characters[Math.floor((Math.random() * $charactersLength - 1) + 1)];
        }
        return $randomString;
    }
}
