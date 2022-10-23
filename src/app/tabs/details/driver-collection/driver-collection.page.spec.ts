import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DriverCollectionPage } from './driver-collection.page';

describe('DriverCollectionPage', () => {
  let component: DriverCollectionPage;
  let fixture: ComponentFixture<DriverCollectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverCollectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DriverCollectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
