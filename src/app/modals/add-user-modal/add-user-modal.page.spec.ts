import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddUserModalPage } from './add-user-modal.page';

describe('AddUserModalPage', () => {
  let component: AddUserModalPage;
  let fixture: ComponentFixture<AddUserModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
