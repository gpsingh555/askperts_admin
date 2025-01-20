import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from "src/app/services/api.service";
import { ToastrService } from "ngx-toastr";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";

interface PeriodicElement {
  position: number;
}

const ELEMENT_DATA: PeriodicElement[] = [{ position: 1 }];

@Component({
  selector: "app-consultant-management",
  templateUrl: "./consultant-management.component.html",
  styleUrls: ["./consultant-management.component.css"],
})
export class ConsultantManagementComponent implements OnInit {
  dataSourceOne: MatTableDataSource<PeriodicElement>;
  displayedColumnsOne: string[] = [
    "position",
    "user_name",
    "email",
    "number",
    "type",
    "address",
    "experience",
    "gender",
    "nationality",
    "document",
    "bank_details",
    "language",
    "action",
  ];
  @ViewChild("TableOnePaginator", { static: true })
  tableOnePaginator!: MatPaginator;

  dataSourceTwo: MatTableDataSource<PeriodicElement>;
  displayedColumnsTwo: string[] = [
    "position",
    "user_name",
    "email",
    "number",
    "type",
    "proof",
    "experience",
    "gender",
    "document",
    "total_user",
    "status",
    "bank_details",
    "doj",
    "rating",
    
    "action",
  ];
  @ViewChild("TableTwoPaginator", { static: true })
  tableTwoPaginator!: MatPaginator;

  dataSourceThree: MatTableDataSource<PeriodicElement>;
  displayedColumnsThree: string[] = [
    "position",
    "user_name",
    "email",
    "number",
    "type",
    "address",
    "experience",
    "gender",
    "nationality",
    "document",
    "bank_details",
    "language",
    "action",
  ];

  @ViewChild("TableThreePaginator", { static: true })
  tableThreePaginator!: MatPaginator;
  newConsultList: any;
  acceptConsultList: any;
  rejectConsultList: any;
  newConsult: any;
  acceptedConsult: any;
  newConsultResult: any;
  acceptedConsultresult: any;
  rejectedConsult: any;
  rejectedConsultresult: any;
  elemetData: any;
  elemetBankData: any;
  blockValue: any;
  elementId: any;
  filterRejectConsultList: any;

  constructor(private api: ApiService, private toastr: ToastrService) {
    this.dataSourceOne = new MatTableDataSource();

    this.dataSourceTwo = new MatTableDataSource();

    this.dataSourceThree = new MatTableDataSource();
  }

  ngOnInit() {
    this.dataSourceOne.data = ELEMENT_DATA;
    this.dataSourceOne.paginator = this.tableOnePaginator;

    this.dataSourceTwo.data = ELEMENT_DATA;
    this.dataSourceTwo.paginator = this.tableTwoPaginator;

    this.dataSourceThree.data = ELEMENT_DATA;
    this.dataSourceThree.paginator = this.tableThreePaginator;

    this.getNewConsult();
    this.getAcceptConsult();
    this.getRejectConsult();
    this.getCategories()
  }

  position: any;

  showModalDialog(element: any) {
    this.elemetData = element;
    console.log("This is element Data", this.elemetData);
    this.position = true;
  }
  addressModal: any;
  showAddressDialog(element: any) {
    this.elemetData = element;
    console.log("This is element Data", this.elemetData);
    this.addressModal = true;
  }

  bank: any;

  banklDialog(element: any) {
    this.elemetBankData = element;
    console.log("This is element Bank Data", this.elemetBankData);
    this.bank = true;
  }
  url1: any;
  onSelectFile1(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event: any) => {
        // called once readAsDataURL is completed
        this.url1 = event.target.result;
      };
    }
  }

  // *********************multiple image ts **************************
  imageurls: string[] = [];
  base64String: any;
  imagePath: any;
  image: any = "base64String";

  removeImage(i: any) {
    this.imageurls.splice(i, 1);
  }

  onSelectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          // console.log("fun calling..")
          // this.imageurls.push({ base64String: event.target.result});
          this.imageurls[i] = event.target.result;
          // this.imageurls.push (event.target.result);
          console.log("imageurls::  " + this.imageurls[0]);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  //-----------------------------   New Cosultant   -------------------------------

  getNewConsult() {
    let data = {
      type: 1,
    };
    this.api.post("consultantManagement", data).subscribe({
      next: (res: any) => {
        this.newConsultList = res.response;
        console.log("This is New Consult List : :", this.newConsultList);
        this.dataSourceOne = new MatTableDataSource(this.newConsultList.reverse());
        this.dataSourceOne.paginator = this.tableOnePaginator;
      },
      error: (err) => {
        console.log(err.message);
        this.toastr.error(err.message);
      },
    });
  }

  searchNewConsult(event: any) {
    this.newConsult = event.target.value;
    let data = {
      type: 1,
      search: this.newConsult,
    };
    this.api.post("consultantManagement", data).subscribe({
      next: (res: any) => {
        this.newConsultResult = res.response;
        this.dataSourceOne = new MatTableDataSource(this.newConsultResult);
        this.dataSourceOne.paginator = this.tableOnePaginator;
      },
      error: (err: any) => {
        console.log(err.error);
      },
    });
  }
  //-----------------------------   Accepet/Reject Cosultant   -------------------------------

  AcceptReject(id: any, type: boolean) {
    debugger;
    let data = {
      isVerified: type,
    };

    this.api.patch(`acceptOrRejectConsultant/${id}`, data).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.getNewConsult();
        this.getRejectConsult();
        this.getAcceptConsult();
      },
    });
  }
  //-----------------------------   Accept Cosultant   -------------------------------

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
        this.dataSourceTwo = new MatTableDataSource(this.acceptConsultList.reverse());
        this.dataSourceTwo.paginator = this.tableTwoPaginator;
      },
      error: (err) => {
        console.log(err.message);
        this.toastr.error(err.message);
      },
    });
  }

  searchAccepted(event: any) {
    this.acceptedConsult = event.target.value;
    let data = {
      type: 2,
      search: this.acceptedConsult,
    };
    this.api.post("consultantManagement", data).subscribe({
      next: (res: any) => {
        this.acceptedConsultresult = res.response;
        this.dataSourceTwo = new MatTableDataSource(this.acceptedConsultresult);
        this.dataSourceTwo.paginator = this.tableTwoPaginator;
      },
      error: (err: any) => {
        console.log(err.error);
      },
    });
  }

  blockUnblock(id: any, event: MatSlideToggleChange) {
    this.blockValue = event.checked;
    this.elementId = id;
    let data = {
      isBlocked: this.blockValue ? 1 : 0,
      type: 2,
    };
    this.api.patch(`block_Unblock_User/${this.elementId}`, data).subscribe({
      next: (res: any) => {
        this.getAcceptConsult();
        if (this.blockValue == 1) {
          this.toastr.error("Consultant Block Successfully");
        } else {
          this.toastr.success("Consultant Unblock Successfully");
        }
      },
      error: (err: any) => {
        console.log(err.error);
      },
    });
  }
  //-----------------------------   Reject Cosultant   -------------------------------

  getRejectConsult() {
    let data = {
      type: 3,
    };
    this.api.post("consultantManagement", data).subscribe({
      next: (res: any) => {
        this.rejectConsultList = res.response;
        console.log(
          "This is Rejected Consult List : :",
          this.rejectConsultList
        );
        this.dataSourceThree = new MatTableDataSource(this.rejectConsultList.reverse());
        this.dataSourceThree.paginator = this.tableThreePaginator;
      },
      error: (err) => {
        console.log(err.message);
        this.toastr.error(err.message);
      },
    });
  }

  searchRejected(event: any) {
    this.rejectedConsult = event.target.value;
    let data = {
      type: 3,
      search: this.rejectedConsult,
    };
    this.api.post("consultantManagement", data).subscribe({
      next: (res: any) => {
        this.rejectedConsultresult = res.response;
        this.dataSourceThree = new MatTableDataSource(
          this.rejectedConsultresult
        );
        this.dataSourceThree.paginator = this.tableThreePaginator;
      },
      error: (err: any) => {
        console.log(err.error);
      },
    });
  }

  deleteRejected(id: any) {
    this.elementId = id;
    let data = {
      is_deleted: true,
    };
    this.api.patch(`deleteConsultant/${this.elementId}`, data).subscribe({
      next: (res: any) => {
        this.getRejectConsult();
          this.toastr.success("Consultant Deleted Successfully.");
      },
      error: (err: any) => {
        console.log(err.error);
      },
    });
  }

  //------------ Filter Table data -----------

  filterNewData : any
 
  consultTypeNewFilter(event : any){
    debugger
    this.filterNewData = event.target.value
    console.log(this.filterNewData);
    let data = {
      type : 1,
      consultation_type : String(this.filterNewData)
    }
    this.api.post('consultantManagement',data).subscribe({
      next : (res : any)=>{

        this.filterRejectConsultList = res.response;

        this.dataSourceOne = new MatTableDataSource(this.rejectConsultList.reverse());
        this.dataSourceOne.paginator = this.tableThreePaginator;
      },
      error : (err : any) => {
        console.log(err.message);
      }
    })
  }

  filterAcceptData :  any
  accepted:any
  consultTypeAcceptFilter(event : any){
    debugger
    this.filterAcceptData = event.target.value
    console.log(this.filterAcceptData);
    
    console.log(this.filterAcceptData);
    let data = {
      type : 2,
      consultation_type : String(this.filterAcceptData)
    }
    this.api.post('consultantManagement',data).subscribe({
      next : (res : any)=>{

        this.acceptConsultList = res.response;

        this.dataSourceTwo = new MatTableDataSource(this.acceptConsultList);
        this.dataSourceTwo.paginator = this.tableTwoPaginator;
      },
      error : (err : any) => {
        console.log(err.message);
      }
    })
  }
  filterRejectData : any
  consultTypeRejectFilter(event : any){
    debugger
    this.filterRejectData = event.target.value
    console.log(this.filterRejectData);
    let data = {
      type : 3,
      consultation_type : String(this.filterRejectData)
    }
    this.api.post('consultantManagement',data).subscribe({
      next : (res : any)=>{

        this.filterRejectConsultList = res.response;

        this.dataSourceThree = new MatTableDataSource(this.rejectConsultList.reverse());
        this.dataSourceThree.paginator = this.tableThreePaginator;
      },
      error : (err : any) => {
        console.log(err.message);
      }
    })
  }

  //------------------ Redirect to New Tab --------------

  redirectToNewTab(url : any){
    debugger
    window.open(url);
  }

  categories:any
  getCategories = ():void=>{
    this.api.get(`category`).subscribe({
        next: (res:any)=>{
          this.categories = res.response;
       
        },
        error: (err:any)=>{
          console.log("Error :",err.message);
        }
      }
    );
  }


  consultTypeAcceptFilter1(event : any){
    debugger
    this.filterAcceptData = event.target.value
    console.log(this.filterAcceptData);
    
    console.log(this.filterAcceptData);
    let data = {
  
      categoryId : this.filterAcceptData
    }
    this.api.post('filterByCategory',data).subscribe({
      next : (res : any)=>{

        this.acceptConsultList = res.response;

        this.dataSourceTwo = new MatTableDataSource(this.acceptConsultList);
        this.dataSourceTwo.paginator = this.tableTwoPaginator;
      },
      error : (err : any) => {
        console.log(err.message);
      }
    })
  }
  value:any
  filterRatingData:any
  filterRating(event:any){
    this.value= event.target.value
    console.log(this.value);

    if(this.value == 0){
      this.dataSourceTwo = new MatTableDataSource(this.acceptConsultList);
      this.dataSourceTwo.paginator = this.tableTwoPaginator;
    }
    else{
    
    this.filterRatingData= this.acceptConsultList.filter((ele:any)=>{
      return this.value == ele.rating
    })
    this.dataSourceTwo = new MatTableDataSource(this.filterRatingData);
    this.dataSourceTwo.paginator = this.tableTwoPaginator;
  } 

  }
}
