import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-show-qr-popover',
  templateUrl: './show-qr-popover.component.html',
  styleUrls: ['./show-qr-popover.component.scss'],
})
export class ShowQrPopoverComponent implements OnInit {

  elementType = 'canvas';
  qrData: any;

  showType: any;

  constructor(private popover: PopoverController, private navParams:NavParams) {
    this.qrData = this.navParams.data.qrData;
  }

  ngOnInit() {
    this.showType = 2;
  }

  closePopover() {
    this.popover.dismiss();
  }

  textToBase64Barcode(text) {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, { format: "CODE39" });
    return canvas.toDataURL("image/png");
  }
  
  segmentChanged(event) {
    this.showType = event.detail.value;
  }

}
