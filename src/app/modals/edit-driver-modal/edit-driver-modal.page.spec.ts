import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditDriverModalPage } from './edit-driver-modal.page';

describe('EditDriverModalPage', () => {
  let component: EditDriverModalPage;
  let fixture: ComponentFixture<EditDriverModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDriverModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDriverModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
