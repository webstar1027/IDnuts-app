import { Injectable } from '@angular/core';
import { Storage} from "@ionic/storage";
//import Encrypt from 'jsencrypt';
import * as CryptoJS from 'crypto-js';
@Injectable()

export class Globals {
    user : any;
    roles = {
        1 : 'Admin',
        2 : 'Parent',
        3 : 'Shipper',
        4 : 'Service Provider',
        5 : 'Dater',
        6 : 'Guardian',
        7 : 'Teacher',
        8 : 'Receiver',
        9 : 'Service Receiver',
        10 : 'Match',

    };
    private key:any = CryptoJS.enc.Utf8.parse('7061737323313233');
    private iv:any =CryptoJS.enc.Utf8.parse('7061737323313233');
    constructor(private storage: Storage){
        this.storage.get('user').then((user) => {
            this.user = user;
        });
    }

    generateUniqueCode(parent,kid,teacher,guardian)
    {

    }
    encrypt(value)
    {
       let encrypted =  CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), this.key,
            {
                keySize: 128 / 8,
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
       return encrypted.toString();
    }
    decrypt (encrypted) {

        let decrypted = CryptoJS.AES.decrypt(encrypted, this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}