import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams,PopoverController} from 'ionic-angular';

/**
 * Generated class for the RolePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-role',
  templateUrl: 'role.html',
})
export class RolePage {
    roles = [
                [
                    {
                      imageUrl: 'assets/img/role/parents.jpg',
                      title: 'Parents',
                      options:[{name:'Parent',value:2},{name:'Guardian',value:6},{name:'Teacher',value:7}]
                    },
                    {
                      imageUrl: 'assets/img/role/shipping.png',
                      title: 'Shippers',
                      options:[{name:'Shipper',value:3},{name:'Receiver',value:8}]
                    }
                ],

                [
                    {
                      imageUrl: 'assets/img/role/service_provider.png',
                      title: 'Service Providers',
                      options:[{name:'Provider',value:4},{name:'Receiver',value:9}]
                    },
                    {
                      imageUrl: 'assets/img/role/dating.png',
                      title: 'Dating',
                      options:[{name:'Dater',value:5},{name:'Lookout',value:10}]
                    }
                ]

    ];
  constructor(public navCtrl: NavController, public navParams: NavParams,public menu: MenuController,public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RolePage');
  }
    ionViewDidEnter() {
        // the root left menu should be disabled on the sign in page
        this.menu.enable(false);
    }
  fun (a) {
    this.navCtrl.push('SignupPage',{a:a})
    //  this.navCtrl.setRoot('SignupPage',{a:a})
  }
    options(role)
    {
        let popover = this.popoverCtrl.create('RoleOptionsPage',role);
        popover.onDidDismiss(data => {
        console.log(data);
        if(data)
        {
            this.fun(data);
        }
    });

        popover.present();
    }
}
