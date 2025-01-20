import { AfterViewInit, ViewChild, Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";


export interface PeriodicElement {
  position: number;
}

const ELEMENT_DATA: PeriodicElement[] = [{ position: 1 }];

@Component({
  selector: 'app-sub-category-management',
  templateUrl: './sub-category-management.component.html',
  styleUrls: ['./sub-category-management.component.css']
})
export class SubCategoryManagementComponent implements OnInit {

  displayedColumns: string[] = [
    "position",
    "sub_category",
    "sub_categoryarabic",
    "image",
    "sub_sub_category",
    
    "action",
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userListData: any;
  searchValue: any;
  afterSearchValue: any;
  blockValue: any;
  elementId: any;
  categoryId!:any;
  subcategories:any[]=[];
  subCategoryForm!:FormGroup;
  isSubmitted:boolean= false;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private route:ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.categoryId = params.get('id')
      this.getSubCategories();
    })
    this.validationForm();
  }

  getSubCategories = ():void=>{
    this.apiService.get(`subCategory/${this.categoryId}`).subscribe({
        next: (res:any)=>{
          this.subcategories = res.response;
          this.dataSource = new MatTableDataSource(this.subcategories);
          this.dataSource.paginator = this.paginator;
        },
        error: (err:any)=>{
          console.log("Error :",err.message);
        }
      }
    );
  }

  validationForm = ():void=>{
    this.subCategoryForm = this.fb.group({
      _id: [''],
      image: ['',Validators.required],
      subCategoryName: ['',Validators.required],
      subCategoryNameArabic:['',Validators.required],
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
    dataToSend.category = this.categoryId;
    this.apiService.post(`subCategory/${this.categoryId}`,dataToSend).subscribe(
      {
        next :(res:any)=>{
          this.isSubmitted = false;
          this.toast.success(res.message);
          this.getSubCategories();
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

  display: boolean = false;

  // upload images
  model: any = {};
  image1: any;
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

  
  addOrEditbuttonAction=(isEditData?:any):void=>{
  
    this.display = true;
    this.subCategoryForm.reset();
    this.image1 = "";
    if(isEditData){
      
      this.subCategoryForm.patchValue({
        _id: isEditData._id,
        image: isEditData.image,
        subCategoryName: isEditData.subCategoryName,
        subCategoryNameArabic:isEditData.subCategoryNameArabic,
        position:isEditData.position
      });
      this.image1 = isEditData.image;
    }
  }

  // deleteCategory = (data:any)=>{
  //   let dataToSend = {
  //     _id:data._id,
  //     is_deleted: true
  //   }
  //   this.apiService.post(`subCategory/${data._id}`,dataToSend).subscribe(
  //     {
  //       next :(res:any)=>{
  //         this.toast.success(res.message);
  //         this.getSubCategories();
  //       },
  //       error :(err:any)=>{
  //         console.log("ERROR :",err);
  //       }
  //     }
  //   );
  // };

  delete:boolean=false;
  delId:any
  deleteCategory(value:any){
    this.delId=value._id
   this.delete=true;
  }
    delete1(){
      this.apiService.post('subCategory/${value._id}',{_id:this.delId,is_deleted:true}).subscribe(
      {
        next :(res:any)=>{
          this.toast.success("subCategory Delete Successfully");
          this.getSubCategories();
        },
        error :(err:any)=>{
          console.log("ERROR :",err);
        }
      }
    );
  };

  searchValues = (searchVal:string):void=>{
    
      let categoriesForLocalUse = [...this.subcategories];
      let filteredValue = categoriesForLocalUse.filter(data=> data.subCategoryName.toLowerCase().includes(searchVal.toLowerCase()));
      this.dataSource = new MatTableDataSource(filteredValue);
      this.dataSource.paginator = this.paginator;
    
  }

}
