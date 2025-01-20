import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edior-dialog',
  templateUrl: './edior-dialog.component.html',
  styleUrls: ['./edior-dialog.component.css']
})
export class EdiorDialogComponent implements OnInit {
  public Editor = ClassicEditor;

  @ViewChild('closeDialog') closeDialog!: ElementRef<HTMLElement>

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<EdiorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data, "Hello");

  }

  addSettingData() {
    console.log(this.data);
    return new Promise((resolve, reject) => {
      this.api.post('addSettingData', this.data).subscribe(() => {
        let el: HTMLElement = this.closeDialog.nativeElement;
        el?.click();
      })
    })
  }



}
