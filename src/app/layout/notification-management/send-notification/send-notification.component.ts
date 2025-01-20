import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.css']
})
export class SendNotificationComponent implements OnInit {
  submitted: any;

  constructor(
    private api :ApiService,
    private toster:ToastrService,
    private router:Router
  ) { }


  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  selectedItems1 = [];
  dropdownSettings1 = {};

  notiifcationForm = new FormGroup({
    title: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required),
    userId: new FormControl(''),
    consultantId: new FormControl('',),
  
  })
  ngOnInit() {
    this.getUserList()
    this.getAcceptConsult()

    this.userList = [
      // { item_id: 1, item_text: 'Mumbai' },
      // { item_id: 2, item_text: 'Bangaluru' },
      // { item_id: 3, item_text: 'Pune' },
      // { item_id: 4, item_text: 'Navsari' },
      // { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      // { item_id: 3, item_text: 'Pune' },
      // { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'firstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.acceptConsultList = [
      // { item_id: 1, item_text: 'Mumbai' },
      // { item_id: 2, item_text: 'Bangaluru' },
      // { item_id: 3, item_text: 'Pune' },
      // { item_id: 4, item_text: 'Navsari' },
      // { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems1 = [
      // { item_id: 3, item_text: 'Pune' },
      // { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings1 = {
      singleSelection: false,
      idField: '_id',
      textField: 'firstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    
  }

  
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  userList:any
  getUserList() {
    this.api.post("userManagement", "").subscribe({
      next: (res: any) => {
        this.userList = res.response;
        console.log("this is user list : : ", this.userList);
     
      },
      error: (err: any) => {
        console.log(err.error);
      },
    });
  }

  get f() {
    
    return this.notiifcationForm.controls;
   
  }

  acceptConsultList:any

  getAcceptConsult() {
    let data = {
      type: 2,
    };
    this.api.post("consultantManagement", data).subscribe({
      next: (res: any) => {
        this.acceptConsultList = res.response;
        console.log(
          "This is Accepted Consult List : :",
          this.acceptConsultList
        );
       
      },
      error: (err) => {
        console.log(err.message);
        
      },
    });
  }

  addNotification() {
    this.submitted =true
    
  
    if (this.notiifcationForm.invalid) {
      return
    }

    if (this.selectedItems.length == 0 && this.selectedItems1.length == 0 ) {
      this.toster.error('Please select atleast one')
      return

    }


    let userName = this.selectedItems.map((item: any) => { return item._id });
    console.log(userName, "hhhhh");

    let consultName = this.selectedItems1.map((item: any) => { return item._id });
    console.log(consultName, "driverName");

 

    this.notiifcationForm.patchValue({
      userId: JSON.stringify(userName),
      consultantId: JSON.stringify(consultName),

    })
    let data = this.notiifcationForm.value

    this.api.post('sendNotification', data).subscribe(data => {
      console.log(data);
      this.toster.success("Notification send succesfully")
      this.router.navigateByUrl('/home/notification-management')
      }, err => {
      console.log(err.message);

    })







  }



  

}
