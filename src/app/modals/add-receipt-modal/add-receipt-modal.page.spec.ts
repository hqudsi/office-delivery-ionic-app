import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddReceiptModalPage } from './add-receipt-modal.page';

describe('AddReceiptModalPage', () => {
  let component: AddReceiptModalPage;
  let fixture: ComponentFixture<AddReceiptModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReceiptModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddReceiptModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
