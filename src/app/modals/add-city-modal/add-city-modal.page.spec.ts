import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddCityModalPage } from './add-city-modal.page';

describe('AddCityModalPage', () => {
  let component: AddCityModalPage;
  let fixture: ComponentFixture<AddCityModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCityModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCityModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
