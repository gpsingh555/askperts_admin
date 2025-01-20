import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

export interface PeriodicElement {
  position: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1 },

];
@Component({
  selector: 'app-consulation-done',
  templateUrl: './consulation-done.component.html',
  styleUrls: ['./consulation-done.component.css']
})
export class ConsulationDoneComponent implements OnInit {
  ngOnInit(): void {
    this.getConsulation()
    // throw new Error('Method not implemented.');
  }
  displayedColumns: string[] = ['position', 'username', 'calltype', 'service_id', 'email_id', 'consultation_id', 'service_date_time', 'call_duration', 'consultation_name', 'rating', 'review'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private apiService: ApiService,
    private toast: ToastrService
  ) { }

  view: boolean = false;
  element: any
  viewDialog(element: any) {
    this.element = element
    console.log(element, "dfghjkl");

    this.view = true;
  }
  consulationData: any
  getConsulation() {
    let data = {
      page_limit: 0,
      page_number: 50
    }
    this.apiService.post('consultant_done', data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.consulationData = res.response
        this.dataSource = new MatTableDataSource(this.consulationData)
        this.dataSource.paginator = this.paginator


      }
    })
  }

  doFilter(event: any) {
    let value = event.target.value;
    // this.dataSource.filter = value.trim().toLocaleLowerCase();
    if (value == "") {
      // console.log("33");
      this.dataSource = new MatTableDataSource(this.consulationData);
      this.dataSource.paginator = this.paginator;

    } else {
      let filterData = this.consulationData.filter((item: any) => {
        let val: String = item.user.firstName
        let val2: String = item.serviceId
        let val3: String = item.call_mode == 1 ? 'Audio' : 'Vedio'
        let val4 :String = item.consultant?.email
        let val5:String =  item.consultant._id


        if (val.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
          // console.log(item);
          return item;
        } else if (val2.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
          console.log(item);
          return item;
        }
        else if (val3.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
          console.log(item);
          return item;
        }
        else if (val4.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
          console.log(item);
          return item;
        }
        else if (val5.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())) {
          console.log(item);
          return item;
        }

        // return val.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase());
      });
      this.dataSource = new MatTableDataSource(filterData);
      this.dataSource.paginator = this.paginator;

    }

  }

}

