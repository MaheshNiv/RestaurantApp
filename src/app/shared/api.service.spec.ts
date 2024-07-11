import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post a restaurant', () => {
    const testData = {
      name: 'Test Restaurant',
      email: 'test@example.com',
      mobile: '1234567890',
      address: 'Test Address',
      services: 'Test Services'
    };

    service.postRestaurent(testData).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:3000/posts');
    expect(req.request.method).toBe('POST');
    req.flush(testData);
  });

  it('should get restaurants', () => {
    const mockData = [
      { id: 1, name: 'Test Restaurant 1', email: 'test1@example.com', mobile: '1234567890', address: 'Test Address 1', services: 'Test Services 1' },
      { id: 2, name: 'Test Restaurant 2', email: 'test2@example.com', mobile: '0987654321', address: 'Test Address 2', services: 'Test Services 2' }
    ];

    service.getRestaurent().subscribe(res => {
      expect(res.length).toBe(2);
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://localhost:3000/posts');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should delete a restaurant', () => {
    const restaurantId = 1;

    service.deleteRestaurant(restaurantId).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:3000/posts/${restaurantId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should update a restaurant', () => {
    const restaurantId = 1;
    const updatedData = {
      name: 'Updated Restaurant',
      email: 'updated@example.com',
      mobile: '9876543210',
      address: 'Updated Address',
      services: 'Updated Services'
    };

    service.updateRestaurant(restaurantId, updatedData).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:3000/posts/${restaurantId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedData);
    req.flush({});
  });
});
