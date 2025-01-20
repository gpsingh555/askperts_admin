import { Dialog } from "@angular/cdk/dialog";
import { Component, OnInit } from "@angular/core";
import { AfterViewInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

export interface PeriodicElement {
  position: number;
}

const ELEMENT_DATA: PeriodicElement[] = [{ position: 1 }];
@Component({
  selector: "app-payment-mgmt",
  templateUrl: "./payment-mgmt.component.html",
  styleUrls: ["./payment-mgmt.component.css"],
})
export class PaymentMgmtComponent implements OnInit {
  transactions: any = [];
  displayedColumns: string[] = [
    "position",
    "transaction_id",
    "date_time",
    "amount",
    "plan_name",
    "user_name",
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  displayedColumns1: string[] = [
    "position",
    "consultant_name",
    "date_time",
    "amount",
    "call_duration",
    "category",
    "user_name",
    "payment",
    "payment_status",
  ];
  dataSource1 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  totalAmount: Number = 5609;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("paginator1") paginator1!: MatPaginator;
  paymentValue: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource1.paginator = this.paginator1;
  }
  adminCharge: any;
  submitted: boolean = false;
  elementId: any;
  fromDate: any
  toDate: any

  constructor(
    private apiService: ApiService,
    private toast: ToastrService,
    private dialog: Dialog
  ) { }

  ngOnInit(): void {
    this.getAllPayments();
    // this.getConsultantPerCallFee();
    this.getAllPayouts();
    this.getAllCommision();
  }

  commisionForm = new FormGroup({
    consultant_per_call_fee: new FormControl(),
  });

  //---------------------------- Date filter Ongoing ---------------------------

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  rangePast = new FormGroup({
    startPast: new FormControl(),
    endPast: new FormControl(),
  });
  view: boolean = false;

  viewDialog() {
    this.view = true;
  }

  getAllPayments = (): void => {
    this.apiService.get(`getTransaction`).subscribe({
      next: (res: any) => {
        this.transactions = res['response']
        console.log("payment details :::", this.transactions);

        this.dataSource = new MatTableDataSource(this.transactions.reverse());
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        console.log("Error :", err.message);
      },
    });
  };

  commission: any
  getAllCommision = (): void => {
    this.apiService.get(`getCommision`).subscribe({
      next: (res: any) => {
        this.commission = res.response;
        console.log("hhhhh::ppppppppppppppppp:", this.commission);
        this.commisionForm.patchValue({
          consultant_per_call_fee: this.commission.consultant_per_call_fee
        })

      },
      error: (err: any) => {
        console.log("Error :", err.message);
      },
    });
  };

  searchValues = (searchVal: string): void => {
    let listForLocalUse = [...this.transactions];
    let filteredValue = listForLocalUse.filter(
      (data) =>
        data._id.toLowerCase().includes(searchVal.toLowerCase()) ||
        data.planName.toLowerCase().includes(searchVal.toLowerCase()) ||
        data.user.firstName.toLowerCase().includes(searchVal.toLowerCase()) ||
        data.amount.toString().includes(searchVal)
    );
    this.dataSource = new MatTableDataSource(filteredValue);
    this.dataSource.paginator = this.paginator;
  };

  closeDialog() {
    this.dialog.closeAll();
  }

  applyFilterSearchPayment(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  // search(data: any) {

  //   let value: string = data.target.value;
  //   // console.log(value);

  //   let filterArray: any = [];
  //   if (value == "") {
  //     this.dataSource = new MatTableDataSource(this.transactions.reverse());
  //     this.dataSource.paginator = this.paginator;
  //   } else {
  //     filterArray = this.transactions.filter((item: any) => {
  //       console.log(item);
  //       let a: string = (item._id == null) ? "" : item._id;
  //       let b: string = (item.amount == null) ? "" : item.amount;
  //       let c: string = (item.planName == null) ? "" : item.planName;
  //       let d: string = (item.user == null) ? "" : item.user.firstName;
  //       if (a.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
  //         console.log(item);
  //         return item;
  //       } else if (b.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
  //         console.log(item);
  //         return item;
  //       }
  //       else if (c.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
  //         console.log(item);
  //         return item;
  //       }
  //       else if (d.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
  //         console.log(item);
  //         return item;
  //       }
  //     })
  //     this.dataSource = new MatTableDataSource(filterArray);
  //     this.dataSource.paginator = this.paginator;
  //   }
  // }


  applyFilterSearchPayout(event: Event) {
    console.log(event, "********event")
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase()
  }


  // ==================== search payout ====================
  filterData(data: any) {
    console.log(data, "datatta")
    let value: string = data.target.value;
    let filterArray: any = [];
    if (value == "") {
      this.dataSource1 = new MatTableDataSource(this.payoutData);
      this.dataSource1.paginator = this.paginator1;
    } else {
      filterArray = this.payoutData.filter((item: any) => {
        let a: string = (item.category?.categoryName == null) ? "" : item?.category?.categoryName;
        let b: string = (item.consultant.accountName == null) ? "" : item?.consultant?.accountName;
        let c: string = (item?.time_duration == null) ? "" : item?.time_duration;
        let d: string = (!item.user?.firstName) ? "" : item?.user?.firstName;
        let e: string = (!item?.amount) ? "" : item?.amount;

        if (a.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
          return item;
        } else if (b.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
          // console.log(item);
          return item;
        }
        else if (c.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
          // console.log(item);
          return item;
        }
        else if (d.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
          // console.log(item);
          return item;
        }
        else if (e.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
          // console.log(item);
          return item;
        }
      })
      this.dataSource1 = new MatTableDataSource(filterArray);
      this.dataSource1.paginator = this.paginator1;
    }
  }

  // filterData1(data: any) {
  //   console.log(data, "datatta")
  //   let value: string = data.target.value;
  //   let filterArray: any = [];
  //   if (value == "") {
  //     this.dataSource = new MatTableDataSource(this.transactions);
  //     this.dataSource.paginator = this.paginator;
  //   } else {
  //     filterArray = this.payoutData.filter((item: any) => {
  //       let a: string = (item.amount == null) ? "" : item?.amount;
  //       let b: string = (item.planName == null) ? "" : item?.planName;
  //       let c: string = (item?.time_duration == null) ? "" : item?.time_duration;
  //       let d: string = (item.user == null) ? "" : item?.user?.firstName;
  //       let e: string = (!item?.amount) ? "" : item?.amount;

  //       if (a.includes(value)) {
  //         return item;
  //       } else if (b.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
  //         // console.log(item);
  //         return item;
  //       }
  //       else if (c.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
  //         // console.log(item);
  //         return item;
  //       }
  //       else if (d.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
  //         // console.log(item);
  //         return item;
  //       }
  //       else if (e.includes(value)) {
  //         // console.log(item);
  //         return item;
  //       }
  //     })
  //     this.dataSource = new MatTableDataSource(filterArray);
  //     this.dataSource.paginator = this.paginator;
  //   }
  // }

  //====================== date filter=========================
  filteredUsers: any
  filteredUsersList: any

  userJoiningDate: any

  dateFilterForpayment() {
   this.filteredUsersList = this.transactions.filter((user: any) => {
      this.userJoiningDate = user.created_on

      return (
        this.userJoiningDate >= new Date(this.fromDate).getTime() &&
        
        this.userJoiningDate <= new Date(this.toDate).getTime()
      );
    },
    )
    console.log(this.filteredUsersList, "*************** filteredUsersList*********")

    this.dataSource = new MatTableDataSource(this.filteredUsersList);
    this.dataSource.paginator = this.paginator;
  }


  payoutJoiningDate: any
  from: any
  filterPayout: any
  to: any
  dateFilterForpayout() {
  this.filterPayout = this.payoutData.filter((user: any) => {
      this.payoutJoiningDate = user.created_on;
      return (
        this.payoutJoiningDate >= new Date(this.from).getTime() &&
        this.payoutJoiningDate <= new Date(this.to).getTime()
      );
    },

    );
    this.dataSource1 = new MatTableDataSource(this.filterPayout);
    this.dataSource1.paginator = this.paginator1;
  }

  // =========================================

  getConsultantPerCallFee() {
    this.submitted = true;
    // let data = {
    //     consultant_per_call_fee: this.transactions.consultant_per_call_fee,
    //     is_update:this.transactions.is_update
    // }
    if (this.commisionForm.invalid) {
      console.log("something went wrong !!");
      return;
    }
    let data = {
      consultant_per_call_fee: this.commisionForm.value.consultant_per_call_fee,
    };
    console.log("dddd", data);

    this.apiService.post("admin_charge", data).subscribe({
      next: (res: any) => {
        this.adminCharge = res.response;
        console.log("admin charge", JSON.stringify(this.adminCharge));
        this.getAllPayments();
        // this.toast.success(res.message);
      },
      error: (err: any) => {
        console.log("Error :", err.message);
      },
    });
  }

  doFilterOngoing(data: any) {
    debugger;
    let value: string = data.target.value;
    let filterArray: any = [];
    if (value == "") {
      this.dataSource = new MatTableDataSource(this.transactions);
      this.dataSource.paginator = this.paginator;
    } else {
      filterArray = this.transactions.filter((item: any) => {
        // console.log(item);
        let a: string = item.user.full_name == null ? "" : item.user.full_name;
        let b: string = !item.userCart.restaurantId.restaurantDetais
          ? ""
          : item.userCart.restaurantId.restaurantDetais.restaurantName;

        if (
          a
            .trim()
            .toLocaleLowerCase()
            .includes(value.trim().toLocaleLowerCase())
        ) {
          // console.log(item);
          return item;
        } else if (
          b
            .trim()
            .toLocaleLowerCase()
            .includes(value.trim().toLocaleLowerCase())
        ) {
          console.log(item);
          return item;
        }
      });
      this.dataSource = new MatTableDataSource(filterArray);
      this.dataSource.paginator = this.paginator;
    }
  }

  doFilterByDate() {
    console.log("Filter Time Applied !!");
    let start = new Date(this.range.value.start).setHours(0, 0, 0, 0);
    let end = new Date(this.range.value.end).setHours(23, 59, 59, 999);
    let rawList: any = [];

    if (start != null && end != null) {
      rawList = this.transactions.filter((item: any) => {
        if (start <= item.purchaseDate && item.purchaseDate <= end) {
          return item;
        }
      });
      console.log(rawList);
      this.dataSource = new MatTableDataSource(rawList);
      this.dataSource.paginator = this.paginator;
    }
  }

  reset() {
    this.range.reset();
    this.getAllPayments();
  }

  // PAYOUT DETAILS

  payoutData: any;
  totalAmountD: any
  getAllPayouts = (): void => {
    this.apiService.get(`payout`).subscribe({
      next: (res: any) => {
        this.payoutData = res['response']
        this.totalAmountD = res
        console.log("All Payouts ", this.payoutData);

        this.dataSource1 = new MatTableDataSource(this.payoutData.reverse());
        this.dataSource1.paginator = this.paginator1;
      },
      error: (err: any) => {
        console.log("Error :", err.message);
      },
    });
  };

  // search(data: any) {
  //   let value: string = data.target.value;
  //   let filterArray: any = [];
  //   if (value == "") {
  //     this.dataSource1 = new MatTableDataSource(this.payoutData);
  //     this.dataSource1.paginator = this.paginator1;
  //   } else {
  //     filterArray = this.payoutData.filter((item: any) => {
  //       // console.log(item);
  //       let a: string =
  //         item.user.firstName + " " + item.user.lastName == null
  //           ? ""
  //           : item.user.firstName + " " + item.user.lastName;
  //       let b: string =
  //         item.consultant.accountName == null
  //           ? ""
  //           : item.consultant.accountName;
  //       let c: string =
  //         item.category.categoryName == null ? "" : item.category.categoryName;

  //       if (
  //         a
  //           .trim()
  //           .toLocaleLowerCase()
  //           .includes(value.trim().toLocaleLowerCase())
  //       ) {
  //         return item;
  //       } else if (
  //         b
  //           .trim()
  //           .toLocaleLowerCase()
  //           .includes(value.trim().toLocaleLowerCase())
  //       ) {
  //         // console.log(item);
  //         return item;
  //       } else if (
  //         c
  //           .trim()
  //           .toLocaleLowerCase()
  //           .includes(value.trim().toLocaleLowerCase())
  //       ) {
  //         // console.log(item);
  //         return item;
  //       }
  //     });
  //     this.dataSource1 = new MatTableDataSource(filterArray);
  //     this.dataSource1.paginator = this.paginator1;
  //   }
  // }

  FilterByDateOnpayout() {
    console.log("Filter Time Applied !!");
    let start = new Date(this.range.value.start).setHours(0, 0, 0, 0);
    let end = new Date(this.range.value.end).setHours(23, 59, 59, 999);
    let rawList: any = [];

    if (start != null && end != null) {
      rawList = this.payoutData.filter((item: any) => {
        if (start <= item.call_start_at && item.call_start_at <= end) {
          return item;
        }
      });
      console.log(rawList);
      this.dataSource1 = new MatTableDataSource(rawList);
      this.dataSource1.paginator = this.paginator1;
    }
  }

  getValue(value: any, id: any) {
    this.paymentValue = value.target.value;

    let data = {
      id: id,
      paymentStatus: this.paymentValue,
    };
    this.apiService.post("changePaymentStatus", data).subscribe({
      next: (res: any) => {
        this.payoutData = res.response;
        console.log("ERER ", this.payoutData.paymentStatus);
        this.getAllPayouts();
      },
    });
  }


}
