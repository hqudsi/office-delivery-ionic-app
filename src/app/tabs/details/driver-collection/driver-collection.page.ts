import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-driver-collection',
  templateUrl: './driver-collection.page.html',
  styleUrls: ['./driver-collection.page.scss'],
})
export class DriverCollectionPage implements OnInit {
  
  userType: any;
  data: any;
  transactions: any;
  approxItemHeight: string = '48px';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) { 
    this.userType = authService.user.type;
  }

  ngOnInit() {
    if (this.route.snapshot.data['data']) {
      this.data = this.route.snapshot.data['data'];
    } else {
      this.router.navigateByUrl('/', {replaceUrl: true});
    }
  }
  
}
