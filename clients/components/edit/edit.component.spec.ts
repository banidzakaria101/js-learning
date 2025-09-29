import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientMasterComponent } from './edit.component';

describe('AddClientMasterComponent', () => {
  let component: AddClientMasterComponent;
  let fixture: ComponentFixture<AddClientMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClientMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClientMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
