import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConnectionStatus, NetworkService } from './services/network.service';
import { OfflineManagerService } from './services/offline-manager.service';
import { LanguageService } from './services/language.service';
import { Capacitor, Plugins, StatusBarStyle } from '@capacitor/core';

const { StatusBar } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private offlineManager: OfflineManagerService,
    private networkService: NetworkService,
    private languageService: LanguageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(this.platform.is("capacitor")) {
        StatusBar.setStyle({style: StatusBarStyle.Dark});
        StatusBar.setBackgroundColor({color: "#e19614"});
        // this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
      this.languageService.setInitialAppLanguage();

      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status == ConnectionStatus.Online) {
          this.offlineManager.checkForEvents().subscribe();
        }
      });

    });
  }
}
