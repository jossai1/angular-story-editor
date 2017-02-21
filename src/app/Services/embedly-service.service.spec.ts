/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmbedlyServiceService } from './embedly-service.service';

describe('EmbedlyServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmbedlyServiceService]
    });
  });

  it('should ...', inject([EmbedlyServiceService], (service: EmbedlyServiceService) => {
    expect(service).toBeTruthy();
  }));
});
