import { Component, OnInit } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
 
  position: number;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position:1}]
@Component({
  selector: 'app-purchased-plan',
  templateUrl: './purchased-plan.component.html',
  styleUrls: ['./purchased-plan.component.css']
})
export class PurchasedPlanComponent implements OnInit {


  displayedColumns: string[] = ['position', 'plan_name', 'call_duration', 'amount','calling_calls', 'expire_date','status'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor() { }

  ngOnInit(): void {
  }


  view: boolean = false;

  viewDialog() {
      this.view = true;
  }

}
