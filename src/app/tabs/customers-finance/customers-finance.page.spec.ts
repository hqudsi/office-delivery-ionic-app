import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomersFinancePage } from './customers-finance.page';

describe('CustomersFinancePage', () => {
  let component: CustomersFinancePage;
  let fixture: ComponentFixture<CustomersFinancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersFinancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersFinancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
