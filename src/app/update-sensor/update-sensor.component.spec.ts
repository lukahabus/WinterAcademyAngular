import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSensorComponent } from './update-sensor.component';

describe('UpdateSensorComponent', () => {
  let component: UpdateSensorComponent;
  let fixture: ComponentFixture<UpdateSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSensorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
