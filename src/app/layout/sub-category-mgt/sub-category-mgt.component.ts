import { Component, OnInit,ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

export interface subcategory {
  id: number;
  subcat: string;
  image: string;
  action: string;
}

const ELEMENT_DATA: subcategory[] = [
  {id:1, subcat: 'Where does it', image: '', action: ''},
  {id:2, subcat: 'Where does', image: '', action: ''},
  {id:3, subcat: 'Where does', image: '', action: ''},
  
];

@Component({
  selector: 'app-sub-category-mgt',
  templateUrl: './sub-category-mgt.component.html',
  styleUrls: ['./sub-category-mgt.component.css']
})
export class SubCategoryMgtComponent implements OnInit {

  displayedColumns: string[] = ['id', 'subcat','subcatarbic', 'image', 'action'];
  dataSource = new MatTableDataSource<subcategory>(ELEMENT_DATA);

  @ViewChild('paginator') paginator!: MatPaginator;
  isSubmitted: any;
  
  ngAfterViewInit() {
     this.dataSource.paginator = this.paginator;
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  model: any = {};
  image1: any;
  searchValue: any;
  afterSearchValue: any;


  // fileChange(event:any) {
  //   if (event.target.files) {
  //     const file = event.target.files[0];

  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.image1 = reader.result;
  //     };
  //   }
  // }
  fileChange(event:any) {
    if (event.target.files) {
      const file = event.target.files[0];

      let sendToFile = new FormData();
      sendToFile.append('image',file);

      this.apiService.post('getImageLink',sendToFile).subscribe({
        next:(res:any)=>{
          //console.log("Image :",res);
          this.image1 = res.data;
          this.subCategoryForm.patchValue({
            image: this.image1
          });
        },
        error:(err:any)=>{
          console.log("Error :",err);
        }
      })
    }
  }

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private route:ActivatedRoute,
    ) { }

    categoryId:any
    ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.categoryId = params.get('id')
      this.getCategories();
    })
    this.validationForm();
    
  
  }
   categories:any
  getCategories = ():void=>{
    this.apiService.get(`subSubCategory/${this.categoryId}`).subscribe({
        next: (res:any)=>{
          this.categories = res.response;
          this.dataSource = new MatTableDataSource(this.categories);
          this.dataSource.paginator = this.paginator;
        },
        error: (err:any)=>{
          console.log("Error :",err.message);
        }
      }
    );
  }

  display: boolean = false;
  subCategoryForm!:FormGroup;

  // showDialog() {
  //     this.display = true;
  // }

  delete:boolean=false;
  delId:any
  deleteCategory(value:any){
    this.delId=value._id
   this.delete=true;
  }
    delete1(){
      this.apiService.post('subSubCategory/${value._id}',{_id:this.delId,is_deleted:true}).subscribe(
      {
        next :(res:any)=>{
          this.toast.success("subCategory Delete Successfully");
          this.getCategories();
        },
        error :(err:any)=>{
          console.log("ERROR :",err);
        }
      }
    );
  };

  searchValues = (searchVal:string):void=>{
    
    let categoriesForLocalUse = [...this.categories];
    let filteredValue = categoriesForLocalUse.filter(data=> data.name.toLowerCase().includes(searchVal.toLowerCase()));
    this.dataSource = new MatTableDataSource(filteredValue);
    this.dataSource.paginator = this.paginator;
  
}

validationForm = ():void=>{
  this.subCategoryForm = this.fb.group({
    _id: [''],
    image: ['',Validators.required],
    name: ['',Validators.required],
    nameArabic: ['',Validators.required],
    position:['',Validators.required]

    //      "is_deleted": false,
  });
}

createCategory=():void=>{
  this.isSubmitted = true;
  if (this.subCategoryForm.invalid) {
    return;
  }
  let dataToSend = {...this.subCategoryForm.value};
  if(!dataToSend._id){
    delete dataToSend._id;
  }
  dataToSend.subCategory = this.categoryId;
  this.apiService.post(`subSubCategory/${this.categoryId}`,dataToSend).subscribe(
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
  return this.subCategoryForm.controls;
}

addOrEditbuttonAction=(isEditData?:any):void=>{
  this.isSubmitted = false
  
  this.display = true;
  this.subCategoryForm.reset();
  this.image1 = "";
  if(isEditData){
    
    this.subCategoryForm.patchValue({
      _id: isEditData._id,
      image: isEditData.image,
      name: isEditData.name,
      nameArabic:isEditData.name,
      position:isEditData.position
    });
    this.image1 = isEditData.image;
  }
}

  

}
