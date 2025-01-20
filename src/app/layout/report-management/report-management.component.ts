import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as XLSX from 'xlsx';

import * as fileSaver from 'file-saver';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDateRangeInput, MatDateSelectionModel } from '@angular/material/datepicker';
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.css']
})
export class ReportManagementComponent implements OnInit {

  dateForm = new FormGroup({
    from: new FormControl(),
    to: new FormControl(),

  })

  constructor(

    private api: ApiService,

  ) { }

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

  checked: any = {
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,

  }


  checkedCheckbox1() {


    this.checked.checkbox1 = true;
    this.checked.checkbox2 = false;
    this.checked.checkbox3 = false;
    this.checked.checkbox4 = false;


  }

  checkedCheckbox2() {


    this.checked.checkbox1 = false;
    this.checked.checkbox2 = true;
    this.checked.checkbox3 = false;
    this.checked.checkbox4 = false;


  }
  checkedCheckbox3() {


    this.checked.checkbox1 = false;
    this.checked.checkbox2 = false;
    this.checked.checkbox3 = true;
    this.checked.checkbox4 = false;


  }
  checkedCheckbox4() {


    this.checked.checkbox1 = false;
    this.checked.checkbox2 = false;
    this.checked.checkbox3 = false;
    this.checked.checkbox4 = true;


  }

  checkedCheckbox(event: any, value: any) {
    this.checked[value] = event.target.checked;
    console.log(value);

    for (const key in this.checked) {
      if (value != key) {
        this.checked[key] = false;
      }
    }
  }

  excelName: any
  exportToExcel() {
    console.log("hiii");

    let xlsxData: any = [];
    let tableata: any = [];
    let value = ""
    for (const key in this.checked) {
      if (this.checked[key] == true) {
        value = key;
      }
    }

    switch (value) {
      case 'checkbox1':
        tableata = this.reportList.userData



        break;
      case 'checkbox2':
        tableata = this.reportList.consultantData
        break;
      case 'checkbox3':
        tableata = this.reportList.consulatDone
        break;
      case 'checkbox4':
        tableata = this.reportList.revenue1


        break;

      default:
        tableata = this.reportList.revenue1
        break;
    }
    console.log(typeof (tableata), "lllllllllllllll")

    let obj;
    if (value == 'checkbox4') {
      this.excelName = "Revenue Report"

      obj = {
        "AllRevenue": tableata


      }
      xlsxData.push(obj)


    } else {

      tableata.forEach((item: any, i: any) => {
        let obj;
        if (value == 'checkbox1') {
          this.excelName = "User Report"
          obj = {
            "FirstName": item.firstName,
            "Email": item.email,
            "countryCode":item.countryCode,
            "MobileNumber": item.mobileNumber


          }

        } if (value == 'checkbox2') {
          this.excelName = "Consultant Report"

          obj = {
            "FirstName": item.firstName,
            "countryCode":item.countryCode,

            "Email": item.email,
            "MobileNumber": item.mobileNumber


          }
        }
        if (value == 'checkbox3') {
          this.excelName = "Consultant Done Report"

          obj = {
            "ServiceId": item.serviceId,
            "Call_review": item.call_review,
            "Call_rating": item.call_rating,
            "FirstName": item?.consultant?.firstName,
            "Email": item?.consultant?.email,







          }
        }





        xlsxData.push(obj)
      }

      );

    }

    // xlsxData = this.exportExcelData;
    this.exportAsExcelFile(xlsxData, this.excelName);
  }
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const myworkbook: XLSX.WorkBook = {
      Sheets: { data: myworksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(myworkbook, {
      bookType: "xlsx",
      type: "array",
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    fileSaver.saveAs(data, fileName + "_List" + EXCEL_EXTENSION);
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
