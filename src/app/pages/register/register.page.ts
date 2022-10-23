import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobileRegex = /^0(5|7)\d{8}$/;
  
  userFG: FormGroup;
  otherFG: FormGroup;
  driverFG: FormGroup;
  regAs: number = 1;
  cities: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthenticationService,
    private router: Router,
    private translatePipe: TranslatePipe
  ) { }

  ngOnInit() {
    this.apiService.getApi(true, 'cities', '/getCities').subscribe(async (res: any) => {
      this.cities = res;
    });

    this.userFG = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });

    this.otherFG = this.formBuilder.group({
      c_name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      manager: ['', [Validators.required]]
    });

    this.driverFG = this.formBuilder.group({
      phone: ['', [Validators.required]],
      company_oid: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
    });


  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  validEmail() {
    let email = this.userFG.value.email;
    return ( this.emailReg.test(email) || ((email.length > 9) && (this.mobileRegex.test(email))) ) ? false : true;
  }

  async register() {
    return 0;
    let dataRequest: any;
    if (this.regAs == 3) {
      dataRequest = {
        ...this.userFG.value,
        ...this.driverFG.value,
        ...{system: 2},
        ...{type: this.regAs}
      };
    } else {
      dataRequest = {
        ...this.userFG.value,
        ...this.otherFG.value,
        ...{system: 2},
        ...{type: this.regAs}
      };
    }

    if ( 
        (this.userFG.valid && this.driverFG.valid && this.regAs == 3) || 
        (this.userFG.valid && this.otherFG.valid && this.regAs != 3)
      ) {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class-1',
          mode: 'md'
        });
        await loading.present();
        
        this.authService.register(dataRequest).subscribe(
          async (res) =>{
            await loading.dismiss();
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.success_register'),this.translatePipe.transform('ALERTS.you_can_log_in'));
              this.router.navigateByUrl('/login', { replaceUrl: true });
            } else {
              if (res.status == 'error_oid') {
                this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.company_not_found'));
              } else if (res.status == 'email_used') {
                this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.email_used'));
              } else {
                this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
              }
            }
          }, async (error) => {
            await loading.dismiss();
            
            this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
          }
        );

    } else {
      this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
    }
    
    
  }

  async showAlert(title, message) {

    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [this.translatePipe.transform('CLOSE')],
    });

    await alert.present();
  }

  get email() {
    return this.userFG.get('email');
  }

  get password() {
    return this.userFG.get('password');
  }

  get confirmPassword() {
    return this.userFG.get('confirmPassword');
  }


}
