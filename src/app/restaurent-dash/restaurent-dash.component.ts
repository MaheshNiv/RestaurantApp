

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { RestaurentData } from './restaurent.model';
import { debounceTime, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-restaurent-dash',
  templateUrl: './restaurent-dash.component.html',
  styleUrls: ['./restaurent-dash.component.css']
})
export class RestaurentDashComponent implements OnInit {

  formValue!: FormGroup;
  restaurentModelObj: RestaurentData = new RestaurentData;
  showAdd!: boolean;
  showBtn!: boolean;
  highestId: number = 0;
  searchControl: FormControl = new FormControl('');
  filteredRestaurentData: any[] = [];
;
  allRestaurentData: any[] = [];

  

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      address: ['', Validators.required],
      services: ['', Validators.required],
    });
   
    
    this.getAllData();
    this.searchControl.valueChanges
    .pipe(debounceTime(300))
    .subscribe(value => this.filterData(value));
    
  }
   /**
   * Handler for clicking the add restaurant button.
   * Resets form values and toggles UI flags.
   */
  clickAddResto() {
    this.formValue.reset();
    this.showAdd = true;
    this.showBtn = false;
  }
  /**
   * Adds a new restaurant using form values.
   * Posts data to the API and updates UI accordingly.
   */
  addRestaurent() {
    this.restaurentModelObj.id =`${this.highestId + 1}`;;
    this.restaurentModelObj.name = this.formValue.value.name;
    this.restaurentModelObj.email = this.formValue.value.email;
    this.restaurentModelObj.mobile = this.formValue.value.mobile;
    this.restaurentModelObj.address = this.formValue.value.address;
    this.restaurentModelObj.services = this.formValue.value.services;

    this.api.postRestaurent(this.restaurentModelObj).subscribe(res => {
      alert("Restaurent Added Successfully");
      this.formValue.reset();

      let ref = document.getElementById('close');
      ref?.click();

      this.getAllData();

    }, err => {
      console.log(err);
      alert("Restaurent Addition Failed!");
    });
  }
 /**
   * Fetches all restaurant data from the API.
   * Updates highestId based on fetched data.
   */
  getAllData() {
    this.api.getRestaurent().subscribe(res => {
      this.allRestaurentData = res;
      this.updateFilteredData();
      // Update the highestId based on current data
      if (this.allRestaurentData.length > 0) {
        this.highestId = Math.max(...this.allRestaurentData.map((restaurant: any) => restaurant.id));
      } else {
        this.highestId = 0;
      }
    }, err => {
      console.log(err);
    });
  }
  /**
   * Filters restaurant data based on search term.
   * Updates filteredRestaurentData array with filtered results.
   *
   * @param searchTerm - Term to filter restaurant names.
   */
  filterData(searchTerm: string) {
    if (!searchTerm) {
      this.filteredRestaurentData = [...this.allRestaurentData];
    } else {
      this.filteredRestaurentData = this.allRestaurentData.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  }
/**
   * Updates filtered data based on current search term.
   */
  updateFilteredData() {
    this.filterData(this.searchControl.value);
  }
   /**
   * Deletes a restaurant record.
   * Calls API to delete data and updates UI.
   *
   * @param data - Restaurant data to be deleted.
   */
 deleteResto(data: any)
  {
    this.api.deleteRestaurant(data).subscribe((res: any) => {
      console.log(res);
      alert("Restaurent Deleted Successfully");
      this.getAllData();
    })
  }
 /**
   * Prepares form for editing restaurant data.
   * Populates form fields with selected restaurant data.
   *
   * @param data - Restaurant data to be edited.
   */
  onEditResto(data: any)
  {
    this.showAdd = false;
    this.showBtn = true;
    
    this.restaurentModelObj.id = data.id;
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['mobile'].setValue(data.mobile);
    this.formValue.controls['address'].setValue(data.address);
    this.formValue.controls['services'].setValue(data.services);

 
  }
    /**
   * Updates restaurant data after editing.
   * Calls API to update data and updates UI accordingly.
   */
  updateResto(){
    this.restaurentModelObj.name = this.formValue.value.name;
    this.restaurentModelObj.email = this.formValue.value.email;
    this.restaurentModelObj.mobile = this.formValue.value.mobile;
    this.restaurentModelObj.address = this.formValue.value.address;
    this.restaurentModelObj.services = this.formValue.value.services;

    this.api.updateRestaurant(this.restaurentModelObj.id,this.restaurentModelObj).subscribe((res: any) => {
      alert("Restaurent Updated Successfully");
      this.formValue.reset();

      let ref= document.getElementById('close');
      ref?.click();

      this.getAllData();

    })
    
  }


}
