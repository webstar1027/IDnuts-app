import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgxQRCodeModule} from "ngx-qrcode2";

/**
 * Generated class for the GenerateQrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-generate-qr',
  templateUrl: 'generate-qr.html',
})
export class GenerateQrPage {
    createdCode:null;
    qrData = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public barcodeScanner : BarcodeScanner,public ngxQRCodeModule : NgxQRCodeModule) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GenerateQrPage');
  }
    createCode() {
        this.createdCode = this.qrData;
    }
}
