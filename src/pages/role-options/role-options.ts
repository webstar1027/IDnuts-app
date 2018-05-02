import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the RoleOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-role-options',
  templateUrl: 'role-options.html',
})
export class RoleOptionsPage {
role : any;
roles  :any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
    this.roles = this.navParams.data;
    console.log(this.roles);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoleOptionsPage');
  }
  close()
  {
      console.log(this.role);
    this.viewCtrl.dismiss(this.role);
  }
}
