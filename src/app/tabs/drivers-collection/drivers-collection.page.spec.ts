import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DriversCollectionPage } from './drivers-collection.page';

describe('DriversCollectionPage', () => {
  let component: DriversCollectionPage;
  let fixture: ComponentFixture<DriversCollectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversCollectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DriversCollectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
