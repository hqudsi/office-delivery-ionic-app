import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinanceChangesPage } from './finance-changes.page';

describe('FinanceChangesPage', () => {
  let component: FinanceChangesPage;
  let fixture: ComponentFixture<FinanceChangesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceChangesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceChangesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
