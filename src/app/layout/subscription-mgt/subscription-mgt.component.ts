import { Component, OnInit,ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

export interface subscription {
  _id: number;
  planName: string;
  duration: string;
  amount: string;
  numberOfCalls:string;
}

const ELEMENT_DATA: subscription[] = [];


@Component({
  selector: 'app-subscription-mgt',
  templateUrl: './subscription-mgt.component.html',
  styleUrls: ['./subscription-mgt.component.css']
})
export class SubscriptionMgtComponent implements OnInit {

  displayedColumns: string[] = ['id', 'planName','planNameArabic', 'duration', 'amount', 'numberOfCalls', 'action'];
  dataSource = new MatTableDataSource<subscription>(ELEMENT_DATA);

  @ViewChild('paginator') paginator!: MatPaginator;

  subscriptions:subscription[] = [];
  subscriptionForm!:FormGroup;
  isSubmitted:boolean = false;

  ngAfterViewInit() {
     this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
    this.apiService.get(`subscription`).subscribe({
        next: (res:any)=>{
          this.subscriptions = res.response;
          this.dataSource = new MatTableDataSource(this.subscriptions);
          this.dataSource.paginator = this.paginator;
        },
        error: (err:any)=>{
          console.log("Error :",err.message);
        }
      }
    );
  }

  validationForm = ():void=>{
    this.subscriptionForm = this.fb.group({
      _id: [''],
      planName: ['',Validators.required],
      duration: ['',Validators.required],
      amount: ['',Validators.required],
      numberOfCalls: ['',Validators.required],
      planNameArabic:['',Validators.required],
      position:['',Validators.required]

    });
  }

  createSubscription=():void=>{
    this.isSubmitted = true;
    if (this.subscriptionForm.invalid) {
      return;
    }

    console.log("Values :",this.subscriptionForm.value);
    let dataToSend = {...this.subscriptionForm.value};
    if(!dataToSend._id){
      delete dataToSend._id;
    }
    this.apiService.post('subscription',dataToSend).subscribe(
      {
        next :(res:any)=>{
          this.toast.success(res.message);
          this.isSubmitted = false;
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
    return this.subscriptionForm.controls;
  }

  display: boolean = false;
  

  addOrEditbuttonAction=(isEditData?:any):void=>{
    
    this.display = true;
    this.subscriptionForm.reset();
    if(isEditData){
      
      this.subscriptionForm.patchValue({
        _id: isEditData._id,
        planName: isEditData.planName,
        duration: isEditData.duration,
        amount: isEditData.amount,
        numberOfCalls: isEditData.numberOfCalls,
        planNameArabic:isEditData.planNameArabic,
        position:isEditData.position
      });
    }
  }

  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
         return false;
      }
      return true;
  
  }

  deleteSubscription = (data:any)=>{
    let dataToSend = {
      _id:data._id,
      is_deleted: true
    }
    this.apiService.post('subscription',dataToSend).subscribe(
      {
        next :(res:any)=>{
          this.toast.success(res.message);
          this.getCategories();
        },
        error :(err:any)=>{
          console.log("ERROR :",err);
        }
      }
    );
  };

  searchValues = (searchVal:string):void=>{
    
      let categoriesForLocalUse = [...this.subscriptions];
      let filteredValue = categoriesForLocalUse.filter(data=> data.planName.toLowerCase().includes(searchVal.toLowerCase()));
      this.dataSource = new MatTableDataSource(filteredValue);
      this.dataSource.paginator = this.paginator;
    
  }

}
