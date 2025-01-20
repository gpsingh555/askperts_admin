import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgetForm!: FormGroup;
  submitted: boolean = false;

  constructor(
    private api : ApiService,
    private router :  Router,
    private formBuilder: FormBuilder,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.forgetForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  get f(){
    return this.forgetForm.controls
  }

  forgetPass(){
    debugger
    this.submitted = true;
    if (this.forgetForm.invalid) {
      console.log("something went wrong !!");
      return;
    }
    let data = this.forgetForm.value;

    this.api.post("forgetPassword", data).subscribe({
      next: (res: any) => {
        console.log(res,
          ":::::::::::::Link has been sent Suucessfully :::::::::::::::"
        );
        // localStorage.setItem("AskPertsAdmin", JSON.stringify(res["response"]));
        this.toastr.success("Link has been sent Suucessfully")
        this.router.navigateByUrl("/login");
      },
      error: (err) => {
        this.toastr.error(err.error.message);
        console.log(err.error);
      },
    });
  }

}
