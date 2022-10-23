import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/core';
import { ActionSheetController, LoadingController, ViewDidEnter } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LanguageService } from 'src/app/services/language.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, ViewDidEnter {

  storageUrl = environment.StorageUrl;
  imageDataSource: any;
  currenctLanguage: String = '';
  userType: any;
  constructor(
    private languageService: LanguageService,
    private actionSheetCtrl: ActionSheetController,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private authService: AuthenticationService,
    private translatePipe: TranslatePipe
    ) { 
      this.userType = authService.user.type;
    }

  ngOnInit() {
    this.currenctLanguage = this.languageService.selected;
    if (this.authService.userDetails.logo) {
      this.imageDataSource = this.storageUrl + this.authService.userDetails.logo;
    }
  }

  ionViewDidEnter() {
    this.apiService.getApi(true, 'userData', '/getUser').subscribe(async (res: any) => {
      this.authService.updateUserData(res);
      this.imageDataSource = this.storageUrl + res.userDetails.logo;
    });
  }

  radioGroupChange(event) {
    this.currenctLanguage = event.detail.value;
    this.languageService.setLanguage(event.detail.value);
    // Reload because our routing is out of place
    window.location.reload();
  }

  async selectImageSource() {
    const buttons = [
      {
        text: this.translatePipe.transform('SETTINGS.take_photo'),
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: this.translatePipe.transform('SETTINGS.choose_photo'),
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];

    if (this.imageDataSource) {
      buttons.push(
        {
          text: this.translatePipe.transform('SETTINGS.delete_photo'),
          icon: 'trash',
          handler: () => {
            this.deleteImage();
          }
        });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translatePipe.transform('SETTINGS.select_source'),
      buttons
    });
    await actionSheet.present();
  }

  deleteImage() {
    this.imageDataSource = null;
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      width: 200,
      height: 200,
      preserveAspectRatio: true,
      source
    });

    const imageData = 'data:image/' + image.format + ';base64,' + image.base64String;
    this.imageDataSource = imageData;

    let dataRequest: any;
    if (this.imageDataSource) {
      dataRequest = {
        ...{image: this.imageDataSource},
        ...{company_id: this.authService.companyId()}
      };
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1',
        mode: 'md'
      });
      await loading.present();

      this.apiService.postApi('/logistics/addCompanyLogo', dataRequest).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res.success) {
            this.authService.setUserDetails(res.data);
            console.log('done');
          } else {
            console.log('error: ', 'res.message');
          }
        }, async (error) => {
          await loading.dismiss();
          console.log('error add image: ', 'error');
        }
      );

    }
  }

}
