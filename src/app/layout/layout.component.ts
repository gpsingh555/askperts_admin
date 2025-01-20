import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmedValidator } from 'src/app/validators/passwordValidators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  sideBarOpen = true;
  constructor(private breakpointObserver: BreakpointObserver,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private toast: ToastrService) { }

  submitted: Boolean = false
  // forgotForm!: FormGroup

  // changepasswordForm =  new FormGroup({
  //   password: new FormControl('',[Validators.required, Validators.minLength(8)]),
  //   newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  //   confirmnewPassword: new FormControl('', [Validators.required]),

  // },
  //   {
  //     validator: ConfirmedValidator('password','newPassword', 'confirmnewPassword'),
  //   })

  changepasswordForm = this.fb.group({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmnewPassword: new FormControl('', [Validators.required]),
  },
    {
      validator: ConfirmedValidator('newPassword', 'confirmnewPassword'),
    })

  ngOnInit(): void {
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  view: boolean = false;
  onClickChangePassword() {
    this.submitted = false
    this.view = true;

  }

  dataReset: any
  changePassword() {
    debugger
    this.submitted = true;
    if (this.changepasswordForm.invalid) {
      return;
    }
    // this.dataReset = localStorage.getItem('AskPertsAdmin')
    // this.dataReset = JSON.parse(this.dataReset)
    let data = {
      password: this.changepasswordForm.value.password,
      newPassword: this.changepasswordForm.value.newPassword,
    }
    delete this.changepasswordForm.value.confirmnewPassword
    this.api.post('changePasswordNew', data).subscribe({
      next: (res: any) => {

        this.toast.success(res.message)
        this.submitted = false
        this.view = false;
        this.changepasswordForm.reset()
      },
      error: (err: any) => {
        // console.log(err.error.message)
      }
    })


  }

  get f() {
    return this.changepasswordForm.controls;

  }
  keyPress(event: any) {
    console.log(event);

    console.log(event.which == 48 , event.target.selectionStart == 1, event.target.selectionStart)

    if(event.which == 48 && event.target.selectionStart == 0) {
        event.preventDefault();
    }

    
  }

}






