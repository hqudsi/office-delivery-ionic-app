import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AddPopoverComponent } from '../popovers/add-popover/add-popover.component';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  
  userType: any;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private popoverController: PopoverController,
    private renderer: Renderer2,
    private apiService: ApiService
  ) {
    this.userType = authService.user.type;
  }

  changed() {
    let element: any = document.getElementById('main-content');
    this.renderer.setStyle(element, 'top', "0px");
    for (let c of element.children) {
      this.renderer.setStyle(c, 'opacity', 1);
    }
  }

  async logout() {
    await this.authService.logout();
    this.apiService.clearStorage();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async addPopover(ev: any) {
    const pop = await this.popoverController.create({
      component: AddPopoverComponent,
      event: ev,
      // showBackdrop: false,
      mode: 'ios'
    });
    return await pop.present();
  }
}
