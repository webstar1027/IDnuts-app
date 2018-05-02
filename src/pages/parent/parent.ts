import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Api} from "../../providers/api/api";
import { Storage } from '@ionic/storage';
import { SelectSearchable } from "../components/select/select";

/**
 * Generated class for the ParentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parent',
  templateUrl: 'parent.html',
})
export class ParentPage {
  guardians:any = [];
  teachers:any = [];
  user:any;
  guardian:any;
  teacher:any;
  kid:any;
    phone:any;
    unique_array:any;
  unique_code:'';
  code_generated:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api,private storage:Storage,public loadingCtrl:LoadingController,public toastCtrl : ToastController) {
      this.kid = this.navParams.get('kid');
      if( this.kid && this.kid.phone)
      {
          this.phone =  this.kid.phone;
      }
      console.log(this.kid);
      if(this.kid && this.kid.unique_code)
      {
          this.unique_code = this.kid.unique_code;
          this.unique_array = this.unique_code.split('');
          this.code_generated = 1;
      }
    this.storage.get('user').then(user =>{
      this.user = user;

        /*let loading = this.loadingCtrl.create();
        loading.present();
      let req = this.api.get('guardians?parent_id='+user.id).share();
      req.subscribe(data =>{
        loading.dismissAll();
          this.guardians = data['data'][0];
          this.teachers = data['data'][1];
          if(this.kid)
          {
              if(this.kid.unique_code)
              {
                  this.unique_code = this.kid.unique_code;
                  this.unique_array = this.unique_code.split('');
                  this.code_generated = 1;
              }
              console.log(this.kid.teacher_id);
              this.teacher = this.teachers[this.teachers.findIndex(item => item.id == this.kid.teacher_id)];
              if(this.kid.guardian_ids)
              {
                  this.kid.guardian_ids += '';
                  this.guardian = this.kid.guardian_ids.split(',');
                  let selectedGuards = [];
                  let count = 0;
                  for (let g of this.guardian)
                  {
                      selectedGuards[count] = this.guardians[this.guardians.findIndex(item => item.id == g)];
                      count++;
                  }
                  this.guardian = selectedGuards;
                  console.log(this.guardian)
              }
          }
          console.log(data);
      },err => {
          loading.dismissAll();
        console.log(err);
      })*/
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParentPage');
  }
    addNewUser()
    {
      this.navCtrl.push('NewUserPage',{type:6});//guardian
    }

    notifyGuardian()
    {console.log(this.guardian);
        let loading = this.loadingCtrl.create();
        loading.present();
        let data :any = {};
        data.kid = this.kid.id;
        data.phone = this.phone;
        data.name = this.kid.name;
        data.class = this.kid.class;
        data.parent = this.user.id;

        data.unique_code = this.unique_code;

        let column = this.teacher;
        if(this.teacher && this.teacher.id)
        {
            column = this.teacher.id;
        }
        data.teacher = column;
        let selectedTeacher = this.teachers[this.teachers.findIndex(item => item.id == column)];
        let selectedGuardianEmails = [];
        let selectedGuardianIds = [];
        let counter = 0;
        for(let guardian of this.guardian)
        {
            column = guardian;
            if(guardian && guardian.id)
            {
                column = guardian.id;
                selectedGuardianEmails.push( guardian.email) ;
            }
            selectedGuardianIds[counter] = column;
            counter++;
        }

        data.guardian = selectedGuardianIds.join();

        data.teacher_email = selectedTeacher.email;
        data.guardian_email = selectedGuardianEmails.join();
        console.log(data);
          let req = this.api.post('assign/guardian',data).share();
          req.subscribe(data =>{
              loading.dismissAll();
              console.log(data);
              let msg = this.toastCtrl.create({
                  message: 'Teacher/Guardian Notified!',
                  duration: 1500,
                  position: 'top'
              });
              msg.present();
              this.navCtrl.push('KidsListPage');
          },err => {
              loading.dismissAll();
              console.log(err);
          });
    }

    onSelect(event: { component: SelectSearchable, value: any }){
    console.log(event.value);
    console.log(this.guardian);
        if(this.guardian.length > 3){
          let dummy = 3 - this.guardian.length;
            this.guardian = this.guardian.slice(0,dummy);
          console.log(this.guardian);
            alert('You can only select upto 3 Guardians');
        }
    }
    searchGuards(event: { component: SelectSearchable, text: string }) {
        let text = (event.text || '').trim().toLowerCase();

        if (!text) {
            event.component.items = [];
            return;
        } else if (event.text.length < 3) {
            return;
        }
        let type:any = event.component.data_type;
        event.component.isSearching = true;
       /* let loading = this.loadingCtrl.create();
        loading.present();*/
        let req = this.api.get('guardians?parent_id='+this.user.id+'&type='+type+'&search='+text).share();
        req.subscribe(data =>{
            //loading.dismissAll();
            if(type == 6)
            {
                this.guardians = data['data'];
            }
            else
            {
                this.teachers = data['data'];
            }
            event.component.items = data['data'];
            event.component.isSearching = false;
            /*if(this.kid)
            {
                console.log(this.kid.teacher_id);
                this.teacher = this.teachers[this.teachers.findIndex(item => item.id == this.kid.teacher_id)];
                if(this.kid.guardian_ids && type == 6)
                {
                    this.kid.guardian_ids += '';
                    this.guardian = this.kid.guardian_ids.split(',');
                    let selectedGuards = [];
                    let count = 0;
                    for (let g of this.guardian)
                    {
                        selectedGuards[count] = this.guardians[this.guardians.findIndex(item => item.id == g)];
                        count++;
                    }
                    this.guardian = selectedGuards;
                    console.log(this.guardian)
                }
            }*/
            console.log(data);
        },err => {
            //loading.dismissAll();
            console.log(err);
        })
       /* this.portService.getPortsAsync().subscribe(ports => {
            event.component.items = ports.filter(port => {
                return port.name.toLowerCase().indexOf(text) !== -1;
            });

            event.component.isSearching = false;
        });*/
    }

    generateUniqueCode()
    {
        let loading = this.loadingCtrl.create();
        loading.present();
        let req = this.api.get('unique/code').share();
        req.subscribe(data =>{
            loading.dismissAll();
            this.unique_code = data['data'];
            this.code_generated = 1;
            this.unique_array = this.unique_code.split('');
            console.log(data);
        },err => {
            loading.dismissAll();
            console.log(err);
        });
    }
}
