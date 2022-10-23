import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ResetPasswordModalPage } from 'src/app/modals/reset-password-modal/reset-password-modal.page';
import { LanguagePopoverComponent } from 'src/app/popovers/language-popover/language-popover.component';
import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobileRegex = /^0(5|7)\d{8}$/;

  credentials: FormGroup;
  currenctLanguage: String = '';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private translatePipe: TranslatePipe,
    private languageService: LanguageService,
    private popoverController: PopoverController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.currenctLanguage = this.languageService.selected;
    this.credentials = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  validEmail() {
    let email = this.credentials.value.email;
    return ( this.emailReg.test(email) || ((email.length > 9) && (this.mobileRegex.test(email))) ) ? false : true;
  }

  async changeLanguage(ev: any) {
    const pop = await this.popoverController.create({
      component: LanguagePopoverComponent,
      event: ev,
      // showBackdrop: false,
      mode: 'ios'
    });
    return await pop.present();
  }

  async login() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();

    this.authService.login(this.credentials.value).subscribe(
      async (res) =>{
        await loading.dismiss();
        if (res.success) {
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        } else {
          if (res.status == 'not_active') {
            this.showAlert(this.translatePipe.transform('ALERTS.user_not_active'));
          } else {
            this.showAlert(this.translatePipe.transform('ALERTS.invalid_username_password'));
          }
        }
      }, async (error) => {
        await loading.dismiss();
        this.showAlert(this.translatePipe.transform('ALERTS.try_again'));
      }
    );
  }

  async showAlert(error) {
    
    const alert = await this.alertController.create({
      header: this.translatePipe.transform('ALERTS.login_failed'),
      message: error,
      buttons: [this.translatePipe.transform('CLOSE')],
    });

    await alert.present();
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }


  async resetPassword() {
    const modal = await this.modalController.create({
      component: ResetPasswordModalPage,
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();
  }
}
