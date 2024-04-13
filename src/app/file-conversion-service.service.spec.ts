import { TestBed } from '@angular/core/testing';

import { FileConversionServiceService } from './file-conversion-service.service';

describe('FileConversionServiceService', () => {
  let service: FileConversionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileConversionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
