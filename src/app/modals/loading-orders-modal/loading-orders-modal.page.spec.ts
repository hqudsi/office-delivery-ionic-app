import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoadingOrdersModalPage } from './loading-orders-modal.page';

describe('LoadingOrdersModalPage', () => {
  let component: LoadingOrdersModalPage;
  let fixture: ComponentFixture<LoadingOrdersModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingOrdersModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingOrdersModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
