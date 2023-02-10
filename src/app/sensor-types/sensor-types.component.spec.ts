import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorTypesComponent } from './sensor-types.component';

describe('SensorTypesComponent', () => {
  let component: SensorTypesComponent;
  let fixture: ComponentFixture<SensorTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
