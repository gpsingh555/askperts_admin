import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-commision',
  templateUrl: './add-commision.component.html',
  styleUrls: ['./add-commision.component.css']
})
export class AddCommisionComponent implements OnInit {
  categories: any;
  subcategories: any;
  subsubcategories: any;
  categoryId: any;
  subcategoryId: any;
  subsubcategoryId: any;

  addComissionForm = new FormGroup({
    _id: new FormControl(''),
    commission: new FormControl('', [Validators.required]),
    category: new FormControl(''),
    subCategory: new FormControl(''),
    subSubCategory: new FormControl('')
  });

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddCommisionComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data, "selected fill data");

    this.getCategories(); // Load all categories initially

    // If in edit mode, set up form with existing data
    if (this.data) {
      // Pre-fill form values with existing data
      this.addComissionForm.patchValue({
        commission: this.data?.commission,
        category: this.data?.category?._id,         // Set category ID for form
        subCategory: this.data?.subCategory?._id,   // Set subcategory ID for form
        subSubCategory: this.data?.subSubCategory?._id // Set subsubcategory ID for form
      });

      // Store selected IDs for loading subcategories and sub-subcategories
      this.categoryId = this.data.category._id;
      this.subcategoryId = this.data.subCategory._id;
      this.subsubcategoryId = this.data.subSubCategory._id;

      // Load subcategories based on selected category
      this.getSubCategories(() => {
        // Load sub-subcategories based on selected subcategory once subcategories are loaded
        this.getSubSubCategories(() => {
          // Once sub-subcategories are loaded, update the subSubCategory control
          this.addComissionForm.get('subSubCategory')?.setValue(this.subsubcategoryId);
        });
      });
    }
  }

  // Fetch categories
  getCategories(): void {
    this.apiService.get('category').subscribe({
      next: (res: any) => {
        this.categories = res.response;
      },
      error: (err: any) => {
        console.log('Error:', err.message);
      }
    });
  }

  // Fetch subcategories based on selected category
  getSubCategories(callback?: Function): void {
    if (!this.categoryId) return;
    this.apiService.get(`subCategory/${this.categoryId}`).subscribe({
      next: (res: any) => {
        this.subcategories = res.response;
        if (callback) callback();
      },
      error: (err: any) => {
        console.log('Error:', err.message);
      }
    });
  }

  // Fetch sub-subcategories based on selected subcategory
  getSubSubCategories(callback?: Function): void {
    if (!this.subcategoryId) return;
    this.apiService.get(`subSubCategory/${this.subcategoryId}`).subscribe({
      next: (res: any) => {
        this.subsubcategories = res.response;
        if (callback) callback();
      },
      error: (err: any) => {
        console.log('Error:', err.message);
      }
    });
  }

  // Selectors for category, subcategory, and sub-subcategory
  selectCategory(event: any): void {
    this.categoryId = event.target.value;
    this.addComissionForm.get('category')?.setValue(this.categoryId);
    this.getSubCategories(() => this.getSubSubCategories()); // Reset subcategory and sub-subcategory on category change
  }

  selectSubCategory(event: any): void {
    this.subcategoryId = event.target.value;
    this.addComissionForm.get('subCategory')?.setValue(this.subcategoryId);
    this.getSubSubCategories();
  }

  selectSubSubCategory(event: any): void {
    this.subsubcategoryId = event.target.value;
    this.addComissionForm.get('subSubCategory')?.setValue(this.subsubcategoryId);
  }

  // Add or Update Commission
  // addCommission(): void {
  //   // let formData = {
  //   //   ...this.addComissionForm.value,
  //   //   categoryId: this.categoryId,
  //   //   subcategoryId: this.subcategoryId,
  //   //   subSubCategory: this.subsubcategoryId
  //   // };
  //   let formData=this.addComissionForm.value;
  //   if (this.data) {
  //     formData._id=this.data._id
  //     // Update commission
  //     this.apiService.post(`addUpdateCommission`, formData).subscribe({
  //       next: (res: any) => {
  //         this.dialogRef.close(true);
  //         this.toastr.success('Commission updated successfully!');
  //       },
  //       error: (err: any) => {
  //         console.log('Error:', err.message);
  //         this.toastr.error('Failed to update commission');
  //       }
  //     });
  //   } else {
  //     // Add new commission
  //     delete formData._id
  //     this.apiService.post('addUpdateCommission', formData).subscribe({
  //       next: (res: any) => {
  //         this.dialogRef.close(true);
  //         this.toastr.success('Commission added successfully!');
  //       },
  //       error: (err: any) => {
  //         console.log('Error:', err.message);
  //         this.toastr.error('Failed to add commission');
  //       }
  //     });
  //   }
  // }

  addCommission(): void {
    // Create a copy of form values
    let formData = { ...this.addComissionForm.value };
  
    // Determine the level for commission based on the selected values
    if (!formData.subSubCategory && formData.subCategory) {
      // If subSubCategory is not selected, remove it from the payload
      delete formData.subSubCategory;
    }
    if (!formData.subCategory && formData.category) {
      // If only category is selected, remove subCategory and subSubCategory
      delete formData.subCategory;
      delete formData.subSubCategory;
    }
  
    // Check if in edit mode (data exists)
    if (this.data) {
      // Edit mode: Include _id for updating
      formData._id = this.data._id;
  
      // Update commission
      this.apiService.post('addUpdateCommission', formData).subscribe({
        next: (res: any) => {
          this.dialogRef.close(true);
          this.toastr.success('Commission updated successfully!');
        },
        error: (err: any) => {
          console.log('Error:', err.message);
          this.toastr.error('Failed to update commission');
        }
      });
    } else {
      // Add mode: Remove _id from the payload
      delete formData._id;
  
      // Add new commission
      this.apiService.post('addUpdateCommission', formData).subscribe({
        next: (res: any) => {
          this.dialogRef.close(true);
          this.toastr.success('Commission added successfully!');
        },
        error: (err: any) => {
          console.log('Error:', err.message);
          this.toastr.error('Failed to add commission');
        }
      });
    }
  }
  
  
  
}
