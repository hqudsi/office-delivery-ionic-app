import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMyCustomerModalPage } from './add-my-customer-modal.page';

describe('AddMyCustomerModalPage', () => {
  let component: AddMyCustomerModalPage;
  let fixture: ComponentFixture<AddMyCustomerModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMyCustomerModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMyCustomerModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
