import { AfterViewInit, ViewChild, Component, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

export interface PeriodicElement {
  position: number;
}

const ELEMENT_DATA: PeriodicElement[] = [{ position: 1 }];
@Component({
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"],
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "user_name",
    "email",
    "number",
    "country",
    "purchased",
    "consultation",
    "joining_date",
    "status",
    "action",
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userListData: any;
  searchValue: any;
  afterSearchValue: any;
  blockValue: any;
  elementId: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(private api: ApiService, private toastr : ToastrService) {}

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.api.post("userManagement", "").subscribe({
      next: (res: any) => {
        this.userListData = res.response;
        console.log("this is user list : : ", this.userListData);
        this.dataSource = new MatTableDataSource(this.userListData.reverse());
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        console.log(err.error);
      },
    });
  }

  searchMethod(event: any) {
    this.searchValue = event.target.value;
    let data = {
      search: this.searchValue,
    };
    this.api.post("userManagement", data).subscribe({
      next: (res: any) => {
        this.afterSearchValue = res.response;
        this.dataSource = new MatTableDataSource(this.afterSearchValue);
        this.dataSource.paginator = this.paginator;
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
      type: 1,
    };
    this.api.patch(`block_Unblock_User/${this.elementId}`, data).subscribe({
      next: (res: any) => {
        this.getUserList();
        this.toastr.success(res.message)
      },
      error: (err: any) => {
        console.log(err.error);
      },
    });
  }
}
