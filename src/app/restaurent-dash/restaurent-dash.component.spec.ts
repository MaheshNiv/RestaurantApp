import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RestaurentDashComponent } from './restaurent-dash.component';
import { ApiService } from '../shared/api.service';
import { of, throwError } from 'rxjs';
import { RestaurentData } from './restaurent.model';

describe('RestaurentDashComponent', () => {
  let component: RestaurentDashComponent;
  let fixture: ComponentFixture<RestaurentDashComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurentDashComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, FormsModule],
      providers: [ApiService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurentDashComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.formValue).toBeTruthy();
  });

  it('should reset form and show add button on clickAddResto', () => {
    component.clickAddResto();
    expect(component.formValue.pristine).toBeTrue();
    expect(component.showAdd).toBeTrue();
    expect(component.showBtn).toBeFalse();
  });

  it('should add restaurant', () => {
    const mockRestaurant: RestaurentData = {
      id: '1',
      name: 'Test Restaurant',
      email: 'test@example.com',
      mobile: 1234567890,
      address: 'Test Address',
      services: 'Test Services'
    };

    spyOn(apiService, 'postRestaurent').and.returnValue(of(mockRestaurant));
    component.formValue.setValue({
      name: 'Test Restaurant',
      email: 'test@example.com',
      mobile: '1234567890',
      address: 'Test Address',
      services: 'Test Services'
    });

    component.addRestaurent();

    expect(apiService.postRestaurent).toHaveBeenCalled();
  });

  it('should get all data and update filtered data', () => {
    const mockData = [
      { id: '1', name: 'Test Restaurant 1', email: 'test1@example.com', mobile: '1234567890', address: 'Test Address 1', services: 'Test Services 1' },
      { id: '2', name: 'Test Restaurant 2', email: 'test2@example.com', mobile: '0987654321', address: 'Test Address 2', services: 'Test Services 2' }
    ];

    spyOn(apiService, 'getRestaurent').and.returnValue(of(mockData));

    component.getAllData();

    expect(component.allRestaurentData.length).toBe(2);
    expect(component.filteredRestaurentData.length).toBe(2);
  });

  it('should filter data based on search term', () => {
    component.allRestaurentData = [
      { id: '1', name: 'Test Restaurant 1', email: 'test1@example.com', mobile: '1234567890', address: 'Test Address 1', services: 'Test Services 1' },
      { id: '2', name: 'Test Restaurant 2', email: 'test2@example.com', mobile: '0987654321', address: 'Test Address 2', services: 'Test Services 2' }
    ];

    component.filterData('1');
    expect(component.filteredRestaurentData.length).toBe(1);
  });

  it('should delete restaurant', () => {
    const mockResponse = { message: 'Deleted Successfully' };
    spyOn(apiService, 'deleteRestaurant').and.returnValue(of(mockResponse));

    component.deleteResto({ id: '1' });

    expect(apiService.deleteRestaurant).toHaveBeenCalled();
  });

  it('should populate form on edit', () => {
    const mockRestaurant: RestaurentData = {
      id: '1',
      name: 'Test Restaurant',
      email: 'test@example.com',
      mobile: 1234567893,
      address: 'Test Address',
      services: 'Test Services'
    };

    component.onEditResto(mockRestaurant);

    expect(component.formValue.value.name).toBe(mockRestaurant.name);
    expect(component.formValue.value.email).toBe(mockRestaurant.email);
    expect(component.formValue.value.mobile).toBe(mockRestaurant.mobile);
    expect(component.formValue.value.address).toBe(mockRestaurant.address);
    expect(component.formValue.value.services).toBe(mockRestaurant.services);
  });

  it('should update restaurant', () => {
    const mockRestaurant: RestaurentData = {
      id: '1',
      name: 'Test Restaurant Updated',
      email: 'test@example.com',
      mobile: 1234567890,
      address: 'Test Address',
      services: 'Test Services'
    };

    spyOn(apiService, 'updateRestaurant').and.returnValue(of(mockRestaurant));

    component.formValue.setValue({
      name: 'Test Restaurant Updated',
      email: 'test@example.com',
      mobile: '1234567890',
      address: 'Test Address',
      services: 'Test Services'
    });

    component.updateResto();

    expect(apiService.updateRestaurant).toHaveBeenCalled();
  });

  it('should handle add restaurant error', () => {
    spyOn(apiService, 'postRestaurent').and.returnValue(throwError('error'));

    component.formValue.setValue({
      name: 'Test Restaurant',
      email: 'test@example.com',
      mobile: '1234567890',
      address: 'Test Address',
      services: 'Test Services'
    });

    component.addRestaurent();

    expect(component.formValue.value.name).toBe('Test Restaurant');
  });

  it('should update filtered data on getAllData call', () => {
    const mockData = [
      { id: '1', name: 'Test Restaurant 1', email: 'test1@example.com', mobile: '1234567890', address: 'Test Address 1', services: 'Test Services 1' },
      { id: '2', name: 'Test Restaurant 2', email: 'test2@example.com', mobile: '0987654321', address: 'Test Address 2', services: 'Test Services 2' }
    ];

    spyOn(apiService, 'getRestaurent').and.returnValue(of(mockData));

    component.getAllData();

    expect(component.allRestaurentData.length).toBe(2);
    expect(component.filteredRestaurentData.length).toBe(2);
  });
});
