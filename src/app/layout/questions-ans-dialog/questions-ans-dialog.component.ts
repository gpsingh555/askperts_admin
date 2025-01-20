import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { EdiorDialogComponent } from '../edior-dialog/edior-dialog.component';

@Component({
  selector: 'app-questions-ans-dialog',
  templateUrl: './questions-ans-dialog.component.html',
  styleUrls: ['./questions-ans-dialog.component.css']
})
export class QuestionsAnsDialogComponent implements OnInit {

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<EdiorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  @ViewChild('closeDialog') closeDialog!: ElementRef<HTMLElement>

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.qaItem) {
      this.questionAnswerForm.patchValue({
        question: this.data.qaItem.question,
        answer: this.data.qaItem.answer
      })
    }
  }

  questionAnswerForm: FormGroup = new FormGroup({
    question: new FormControl('', Validators.required),
    answer: new FormControl('', Validators.required)
  })

  submitted: boolean = false;
  addQuestionAnswer() {
    this.submitted = true;
    if (this.questionAnswerForm.invalid) {
      console.log("Invalid");
      return
    }

    let data = this.questionAnswerForm.value;
    data.panel = this.data.panel;
    if (this.data.qaItem && this.data.qaItem._id) {
      data.id = this.data.qaItem._id
    }
    // console.log(data);
    this.api.post('addFaq', data).subscribe((result) => {
      console.log(result);
      this.closeDialog.nativeElement.click();
    })

  }

}
