import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSensorsTypeComponent } from './add-update-sensors-type.component';

describe('AddUpdateSensorsTypeComponent', () => {
  let component: AddUpdateSensorsTypeComponent;
  let fixture: ComponentFixture<AddUpdateSensorsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateSensorsTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateSensorsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
