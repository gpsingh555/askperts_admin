import { Component, OnInit } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

export interface PeriodicElement {
 
  position: number;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position:1}]

@Component({
  selector: 'app-sub-admin',
  templateUrl: './sub-admin.component.html',
  styleUrls: ['./sub-admin.component.css']
})
export class SubAdminComponent implements OnInit {

  subAdmins:any = [];
  selectedSubAdmin:any;
  displayedColumns: string[] = ['position', 'name', 'email', 'mobileNumber','view_module', 'send_credential', 'edit','delete'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private apiService : ApiService,
    private toast : ToastrService,
    private route : Router
    ) { }

  ngOnInit(): void {
    this.getSubAdmins();
  }


  getSubAdmins = ():void=>{
    this.apiService.get(`subAdmin`).subscribe({
        next: (res:any)=>{
          this.subAdmins = res.response;
          this.dataSource = new MatTableDataSource(this.subAdmins.reverse());
          this.dataSource.paginator = this.paginator;
        },
        error: (err:any)=>{
          console.log("Error :",err.message);
        }
      }
    );
  }

  deleteSubAdmin = (id:string):void =>{
    this.apiService.post(`subAdmin`,{_id:id,is_deleted:true}).subscribe({
        next: (res:any)=>{
          this.toast.success('SubAdmin deleted successfully');
          this.getSubAdmins();
        },
        error: (err:any)=>{
          console.log("Error :",err.message);
        }
      }
    );
  }


  view: boolean = false;

  viewDialog(data:any) {
      this.view = true;
      this.selectedSubAdmin = data;
      console.log(this.selectedSubAdmin);
      
  }

  refirectToEdit(data:any){
      this.route.navigate(['/home/add-admin'], {
        queryParams: { pass: JSON.stringify(data) },
    });
  }

  searchValues = (searchVal:string):void=>{
    
    let listForLocalUse = [...this.subAdmins];
    let filteredValue = listForLocalUse.filter(data=> data.name.toLowerCase().includes(searchVal.toLowerCase()) || data.email.toLowerCase().includes(searchVal.toLowerCase()) || data.mobileNumber.toLowerCase().includes(searchVal.toLowerCase()));
    this.dataSource = new MatTableDataSource(filteredValue);
    this.dataSource.paginator = this.paginator;
    
  }

  sendCredentials(data:any){
    this.apiService.post(`sendEmail`,{
        email:data.email,
        password:data.passwordInWords
      }).subscribe({
        next: (res:any)=>{
          this.toast.success(res.message);
        },
        error: (err:any)=>{
          console.log("Error :",err.message);
        }
      }
    );
  }
}
