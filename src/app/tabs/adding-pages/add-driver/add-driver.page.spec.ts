import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddDriverPage } from './add-driver.page';

describe('AddDriverPage', () => {
  let component: AddDriverPage;
  let fixture: ComponentFixture<AddDriverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDriverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddDriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
