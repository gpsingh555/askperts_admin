import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { EdiorDialogComponent } from '../edior-dialog/edior-dialog.component';
import { QuestionsAnsDialogComponent } from '../questions-ans-dialog/questions-ans-dialog.component';

interface faqDataInterface {
  0: any[];
  1: any[]

}
@Component({
  selector: 'app-cms-management',
  templateUrl: './cms-management.component.html',
  styleUrls: ['./cms-management.component.css']
})
export class CmsManagementComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.getSettingData();
    this.getFaqData();
  }

  onclickEdit() {
    let dialogRef = this.dialog.open(EdiorDialogComponent, {
      data: {
        panel: this.panel,
        type: (this.panel == 0) ? this.typeUser : this.typeConsultant,
        value: this.getLocalSettingData()
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getSettingData();
    })
  }

  onClickQuedtions(item: any = null) {
    let dialogRef = this.dialog.open(QuestionsAnsDialogComponent, {
      data: {
        qaItem: item,
        panel: this.panel
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getFaqData();
    })
  }

  settingData: any;
  getSettingData() {
    return new Promise((resolve, reject) => {
      this.api.get('getSettingData').subscribe((result: any) => {
        this.settingData = result.response;
        console.log(this.settingData);

      })
    })
  }

  faqData: faqDataInterface = {
    0: [],
    1: []
  };
  getFaqData() {
    return new Promise((resolve, reject) => {
      this.api.get('getFaq').subscribe((result: any) => {
        let faqData: any[] = result.response;
        this.faqData[0] = faqData.filter((item: any) => {
          return item.type == 0;
        })
        this.faqData[1] = faqData.filter((item: any) => {
          return item.type == 1;
        })
        console.log(this.faqData);

      })
    })

  }

  upperMatTab: any = {
    0: "userData",
    1: "consultantData"
  }
  settingHeading: any = {
    0: "termsAndCondtion",
    1: "privacyPolicy"
  }
  panel: number = 0;
  typeUser: number = 0;
  typeConsultant: number = 0;

  getLocalSettingData() {
    if (!this.settingData) {
      return "";
    }
    else {
      return this.settingData[this.upperMatTab[this.panel]][0][this.settingHeading[(this.panel == 0) ? this.typeUser : this.typeConsultant]];
    }
  }





}
