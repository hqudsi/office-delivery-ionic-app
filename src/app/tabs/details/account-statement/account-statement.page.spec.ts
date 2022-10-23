import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountStatementPage } from './account-statement.page';

describe('AccountStatementPage', () => {
  let component: AccountStatementPage;
  let fixture: ComponentFixture<AccountStatementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountStatementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountStatementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
