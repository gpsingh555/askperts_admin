import { AfterViewInit, ViewChild, Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

export interface PeriodicElement {
  position: number;
}

const ELEMENT_DATA: PeriodicElement[] = [{ position: 1 }];
@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "categoryName",
    "categoryNamearabic",
    "image",
    "sub_category",
    
    "action",
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userListData: any;
  searchValue: any;
  afterSearchValue: any;
  blockValue: any;
  elementId: any;

  categories:any[]=[];
  categoryForm!:FormGroup;
  isSubmitted:boolean = false;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
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
    this.apiService.get(`category`).subscribe({
        next: (res:any)=>{
          this.categories = res.response;
          console.log("j");
          
          this.dataSource = new MatTableDataSource(this.categories);
          this.dataSource.paginator = this.paginator;
        },
        error: (err:any)=>{
          console.log("Error :",err.message);
        }
      }
    );
  }

  validationForm = ():void=>{
    this.categoryForm = this.fb.group({
      _id: [''],
      image: ['',Validators.required],
      categoryName: ['',Validators.required],
      categoryNameArabic: ['',Validators.required],
      position:['',Validators.required]

      //      "is_deleted": false,
    });
  }

  createCategory=():void=>{
    this.isSubmitted = true;
    if (this.categoryForm.invalid) {
      return;
    }

    console.log("Values :",this.categoryForm.value);
    let dataToSend = {...this.categoryForm.value};
    if(!dataToSend._id){
      delete dataToSend._id;
    }
    this.apiService.post('category',dataToSend).subscribe(
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
    return this.categoryForm.controls;
  }

  // modal add images
 // model: any = {};
  image1: any;
  fileChange(event:any) {
    if (event.target.files) {
      const file = event.target.files[0];

      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   this.image1 = reader.result;
      // };

      let sendToFile = new FormData();
      sendToFile.append('image',file);

      this.apiService.post('getImageLink',sendToFile).subscribe({
        next:(res:any)=>{
          //console.log("Image :",res);
          this.image1 = res.data;
          this.categoryForm.patchValue({
            image: this.image1
          });
        },
        error:(err:any)=>{
          console.log("Error :",err);
        }
      })

    }
  }

  display: boolean = false;

  addOrEditbuttonAction=(isEditData?:any):void=>{
    
    this.display = true;
    this.categoryForm.reset();
    this.image1 = "";
    if(isEditData){
      
      this.categoryForm.patchValue({
        _id: isEditData._id,
        image: isEditData.image,
        categoryName: isEditData.categoryName,
        categoryNameArabic:isEditData.categoryNameArabic,
        position:isEditData.position
      });
      this.image1 = isEditData.image;
    }
  }
  delete:boolean=false;
  delId:any
  deleteCategory(value:any){
    this.delId=value._id
    console.log(this.delId)
   this.delete=true;
  }
    delete1(){
      this.apiService.post('category',{_id:this.delId,is_deleted:true}).subscribe(
      {
        next :(res:any)=>{
          this.toast.success("Category Delete Successfully");
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
      let filteredValue = categoriesForLocalUse.filter(data=> data.categoryName.toLowerCase().includes(searchVal.toLowerCase()));
      this.dataSource = new MatTableDataSource(filteredValue);
      this.dataSource.paginator = this.paginator;
    
  }

}
