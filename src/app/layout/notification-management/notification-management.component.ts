import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';

export interface PeriodicElement {
  position: number;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1},
  
];

@Component({
  selector: 'app-notification-management',
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.css']
})
export class NotificationManagementComponent implements OnInit {
  displayedColumns: string[] = ['position', 'date', 'time', 'description'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private api :ApiService
  ) { }

  ngOnInit(): void {
    this.getNotification()
    this.dataSource.paginator=this.paginator
  }

  notificationList:any
  getNotification() {
    this.api.get("getNotification").subscribe({
      next: (res: any) => {
        this.notificationList = res.response;
        console.log("this is user list : : ", this.notificationList);
        this.dataSource = new MatTableDataSource(this.notificationList)
        this.dataSource.paginator=this.paginator
        
      },
      error: (err: any) => {
        console.log(err.error);
      },
    });
  }


}
