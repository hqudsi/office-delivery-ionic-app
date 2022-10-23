import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AddPopoverComponent } from './popovers/add-popover/add-popover.component';

import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { AddMyCustomerModalPageModule } from './modals/add-my-customer-modal/add-my-customer-modal.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StatusPopoverComponent } from './popovers/status-popover/status-popover.component';
import { ChangeStatusModalPageModule } from './modals/change-status-modal/change-status-modal.module';
import { AddPaymentModalPageModule } from './modals/add-payment-modal/add-payment-modal.module';
import { AddReceiptModalPageModule } from './modals/add-receipt-modal/add-receipt-modal.module';
import { PackgesPopoverComponent } from './popovers/packges-popover/packges-popover.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ShowQrPopoverComponent } from './popovers/show-qr-popover/show-qr-popover.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { AddCityModalPageModule } from './modals/add-city-modal/add-city-modal.module';
import { LanguagePopoverComponent } from './popovers/language-popover/language-popover.component';
import { ResetPasswordModalPageModule } from './modals/reset-password-modal/reset-password-modal.module';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EditOrderModalPageModule } from './modals/edit-order-modal/edit-order-modal.module';
import { AddUserModalPageModule } from './modals/add-user-modal/add-user-modal.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { EditDriverModalPageModule } from './modals/edit-driver-modal/edit-driver-modal.module';
import { EditFilterModalPageModule } from './modals/edit-filter-modal/edit-filter-modal.module';
import { ChangeOrdersStatusModalPageModule } from './modals/change-orders-status-modal/change-orders-status-modal.module';
import { DateTimeFormatPipe } from './pipes/date-time-format.pipe';
import { PipesModule } from './pipes/pipes.module';
import { ChangePasswordModalPageModule } from './modals/change-password-modal/change-password-modal.module';
import { LoadingOrdersModalPageModule } from './modals/loading-orders-modal/loading-orders-modal.module';
import { DriverCollectionVoucherModalPageModule } from './modals/driver-collection-voucher-modal/driver-collection-voucher-modal.module';
import { CustomerPaymentModalPageModule } from './modals/customer-payment-modal/customer-payment-modal.module';
import { DriverOrdersReportPageModule } from './modals/driver-orders-report/driver-orders-report.module';
import { CustomerOrdersReportPageModule } from './modals/customer-orders-report/customer-orders-report.module';
import { ChangeTransCostModalPageModule } from './modals/change-trans-cost-modal/change-trans-cost-modal.module';
import { ChangePackModalPageModule } from './modals/change-pack-modal/change-pack-modal.module';
import { ChangeWhoPayModalPageModule } from './modals/change-who-pay-modal/change-who-pay-modal.module';
import { EditUserModalPageModule } from './modals/edit-user-modal/edit-user-modal.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, AddPopoverComponent, StatusPopoverComponent, PackgesPopoverComponent, ShowQrPopoverComponent, LanguagePopoverComponent],
  entryComponents: [AddPopoverComponent, StatusPopoverComponent, PackgesPopoverComponent, ShowQrPopoverComponent, LanguagePopoverComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule,
    AddCityModalPageModule,
    AddMyCustomerModalPageModule,
    AddPaymentModalPageModule,
    AddReceiptModalPageModule,
    AddUserModalPageModule,
    ChangeStatusModalPageModule,
    ChangeOrdersStatusModalPageModule,
    ChangePasswordModalPageModule,
    ChangeTransCostModalPageModule,
    ChangePackModalPageModule,
    ChangeWhoPayModalPageModule,
    DriverCollectionVoucherModalPageModule,
    DriverOrdersReportPageModule,
    CustomerOrdersReportPageModule,
    CustomerPaymentModalPageModule,
    EditDriverModalPageModule,
    EditFilterModalPageModule,
    EditOrderModalPageModule,
    EditUserModalPageModule,
    LoadingOrdersModalPageModule,
    ResetPasswordModalPageModule,
    IonicStorageModule.forRoot(),
    NgxQRCodeModule,
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    PipesModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    FileOpener,
    BarcodeScanner,
    CallNumber
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
