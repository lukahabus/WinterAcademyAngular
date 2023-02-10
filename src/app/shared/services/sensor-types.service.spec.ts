import { TestBed } from '@angular/core/testing';

import { SensorTypesService } from './sensor-types.service';

describe('SensorTypesService', () => {
  let service: SensorTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
