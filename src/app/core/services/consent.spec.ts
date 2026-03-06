import { TestBed } from '@angular/core/testing';
import { ConsentService } from './consent';

describe('ConsentService', () => {
  let service: ConsentService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts as pending when localStorage is empty', () => {
    expect(service.isPending).toBe(true);
  });

  it('stores accepted state in localStorage', () => {
    service.accept();
    expect(localStorage.getItem('cookie_consent')).toBe('accepted');
    expect(service.consent()).toBe('accepted');
  });

  it('clears state on revoke', () => {
    service.accept();
    service.revoke();
    expect(service.isPending).toBe(true);
    expect(localStorage.getItem('cookie_consent')).toBeNull();
  });
});
