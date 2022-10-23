import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditOrderModalPage } from './edit-order-modal.page';

describe('EditOrderModalPage', () => {
  let component: EditOrderModalPage;
  let fixture: ComponentFixture<EditOrderModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrderModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditOrderModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
