import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeOrdersStatusModalPage } from './change-orders-status-modal.page';

describe('ChangeOrdersStatusModalPage', () => {
  let component: ChangeOrdersStatusModalPage;
  let fixture: ComponentFixture<ChangeOrdersStatusModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOrdersStatusModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeOrdersStatusModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
