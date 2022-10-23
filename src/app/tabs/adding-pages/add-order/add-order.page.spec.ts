import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddOrderPage } from './add-order.page';

describe('AddOrderPage', () => {
  let component: AddOrderPage;
  let fixture: ComponentFixture<AddOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
