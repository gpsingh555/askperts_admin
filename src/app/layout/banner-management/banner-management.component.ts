import { Component, OnInit,ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

export interface bannerMgt {
  id: number;
  bannerName: string;
  image: string;
}

const ELEMENT_DATA: bannerMgt[] = [];

@Component({
  selector: 'app-banner-management',
  templateUrl: './banner-management.component.html',
  styleUrls: ['./banner-management.component.css']
})
export class BannerManagementComponent implements OnInit {

  displayedColumns: string[] = ['position', 'bannerName','bannerarabic', 'image', 'edit', 'enabledata'];
  dataSource = new MatTableDataSource<bannerMgt>(ELEMENT_DATA);

  @ViewChild('paginator') paginator!: MatPaginator;
  ngAfterViewInit() {
     this.dataSource.paginator = this.paginator;
  }

  banners:any[]=[];
  bannerForm!:FormGroup;
  isSubmitted:boolean = false;

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }


  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.validationForm();
  }

  getCategories = ():void=>{
    this.apiService.get(`banner`).subscribe({
        next: (res:any)=>{
          this.banners = res.response;
          this.dataSource = new MatTableDataSource(this.banners.reverse());
          this.dataSource.paginator = this.paginator;
        },
        error: (err:any)=>{
          console.log("Error :",err.message);
        }
      }
    );
  }

  validationForm = ():void=>{
    this.bannerForm = this.fb.group({
      _id: [''],
      image: ['',Validators.required],
      bannerName: ['',Validators.required],
      urlLink:['',Validators.required],
      bannerNameArabic:['',Validators.required]
      //      "is_deleted": false,
    });
  }

  createCategory=():void=>{
    this.isSubmitted = true;
    if (this.bannerForm.invalid) {
      return;
    }

    console.log("Values :",this.bannerForm.value);
    let dataToSend = {...this.bannerForm.value};
    if(!dataToSend._id){
      delete dataToSend._id;
    }
    this.apiService.post('banner',dataToSend).subscribe(
      {
        next :(res:any)=>{
          this.isSubmitted = false;
          this.toast.success(res.message);
          this.getCategories();
          this.display = false;
        },
        error :(err:any)=>{
          console.log("ERROR :",err);
        }
      }
    );

  }

  get form1():{ [key: string]: AbstractControl; }{
    return this.bannerForm.controls;
  }

  display: boolean = false;
  // showDialog() {
  //     this.display = true;
  // }

  model: any = {};
  image2: any;
  fileChange(event:any) {
    if (event.target.files) {
      const file = event.target.files[0];

      let sendToFile = new FormData();
      sendToFile.append('image',file);

      this.apiService.post('getImageLink',sendToFile).subscribe({
        next:(res:any)=>{
          //console.log("Image :",res);
          this.image2 = res.data;
          this.bannerForm.patchValue({
            image: this.image2
          });
        },
        error:(err:any)=>{
          console.log("Error :",err);
        }
      })
    }
  }

  addOrEditbuttonAction=(isEditData?:any):void=>{
    
    this.display = true;
    this.bannerForm.reset();
    this.image2 = "";
    if(isEditData){
      
      this.bannerForm.patchValue({
        _id: isEditData._id,
        image: isEditData.image,
        bannerName: isEditData.bannerName,
        urlLink:isEditData.urlLink,
        bannerNameArabic:isEditData.bannerNameArabic
      });
      this.image2 = isEditData.image;
    }
  }

  changeActivity = (event:any,data:any)=>{

    let dataToSend = {
      _id:data._id,
      is_active: event.checked
    }
    
    this.apiService.post('banner',dataToSend).subscribe(
      {
        next :(res:any)=>{
          if(event.checked){
            this.toast.success("Banner acitvated successfully");
          }else{
            this.toast.success("Banner inactivated successfully");
          }
          this.getCategories();
        },
        error :(err:any)=>{
          console.log("ERROR :",err);
        }
      }
    );
  };

  searchValues = (searchVal:string):void=>{
  
      let categoriesForLocalUse = [...this.banners];
      let filteredValue = categoriesForLocalUse.filter(data=> data.bannerName.toLowerCase().includes(searchVal.toLowerCase()));
      this.dataSource = new MatTableDataSource(filteredValue);
      this.dataSource.paginator = this.paginator;
    
  }

}
