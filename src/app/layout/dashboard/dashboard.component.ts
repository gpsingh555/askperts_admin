import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dateForm = new FormGroup({
    from: new FormControl(),
    to: new FormControl(),

  })

  constructor(
    private api: ApiService
  ) { 
   
  }

  ngOnInit(): void {
    this.getReportData()
  }
  reportList: any
  getReportData() {
    this.api.get("reportData").subscribe({
      next: (res: any) => {
        this.reportList = res.response;
        console.log("this is report list : : ", this.reportList);

      },
      error: (err: any) => {
        console.log(err.error);
      },
    });
  }
  fromD: any
  applyFilter() {
    let data = this.dateForm.value
    console.log(data);
    // data.from = this.dateForm.value.from

    data.from = new Date(this.dateForm.value.from).setHours(0, 0, 0, 0)
    data.to = new Date(this.dateForm.value.to).setHours(23, 59, 59, 999)
    console.log(data, "dfghyjukilo")

    this.api.post('filterReportData', data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.reportList = res.response;





      }, error: (e) => {
        console.log(e.error.message);

      }
    })

  }

  reset() {
    this.dateForm.reset();
    this.getReportData()
  }

  today=new Date();

}
