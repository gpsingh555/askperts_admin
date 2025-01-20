import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { AddCommisionComponent } from './add-commision/add-commision.component';
import { ApiService } from 'src/app/services/api.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';

export interface PeriodicElement {
  name: string;
  position: number;
 comm:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', comm:''},
];


@Component({
  selector: 'app-commision-percentage-management',
  templateUrl: './commision-percentage-management.component.html',
  styleUrls: ['./commision-percentage-management.component.css']
})
export class CommisionPercentageManagementComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'comm', 'act'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild("MatPaginator1") MatPaginator1 !: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.MatPaginator1;
  }

  categories:any;
  blockValue:any;
  constructor(private dialog:MatDialog,
    private apiService:ApiService,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  add(data:any){
  const dialogRef=  this.dialog.open(AddCommisionComponent,{
    data:data

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      this.getCategories();
    });

  }

  

  getCategories = ():void=>{
    this.apiService.post(`getCommission`,{}).subscribe({
        next: (res:any)=>{
          this.categories = res.response;          
          this.dataSource = new MatTableDataSource(this.categories.reverse());
          this.dataSource.paginator = this.MatPaginator1;
        },
        error: (err:any)=>{
          console.log("Error :",err.message);
        }
      }
    );
  }


  blockUnblock(id: any, event: MatSlideToggleChange) {
    this.blockValue = event.checked;
    let data = {
      isBlocked: this.blockValue ? true: false,
       _id:id
    };
    this.apiService.patch(`blockUnblockCommission`, data).subscribe({
      next: (res: any) => {
        this.getCategories();
        this.toastr.success(res.message)
      },
      error: (err: any) => {
        console.log(err.error);
      },
    });
  }

  search(data: any) {
    let value: string = data.target.value.trim().toLowerCase();
    let filterArray: any = [];
  
    if (value === "") {
      // If the search field is empty, reset the dataSource
      this.dataSource = new MatTableDataSource(this.categories);
      this.dataSource.paginator = this.MatPaginator1;
    } else {
      // Filter based on category, subcategory, and subsubcategory names
      filterArray = this.categories.filter((item: any) => {
        const categoryName = item?.category?.categoryName?.toLowerCase() || "";
        const subCategoryName = item?.subCategory?.subCategoryName?.toLowerCase() || "";
        const subSubCategoryName = item?.subSubCategory?.name?.toLowerCase() || "";
  
        // Check if the search value is included in any of the names
        return (
          categoryName.includes(value) ||
          subCategoryName.includes(value) ||
          subSubCategoryName.includes(value)
        );
      });
  
      // Update dataSource with filtered results
      this.dataSource = new MatTableDataSource(filterArray);
      this.dataSource.paginator = this.MatPaginator1;
    }
  }
  


  
 


 
}

