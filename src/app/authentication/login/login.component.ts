import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

declare var $: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {

  
  hide = true;
  loginForm!: FormGroup;
  submitted: Boolean = false;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr : ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      // password: ['', [Validators.required]],

       password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$')]],
    });
  }

  get f(){
    return this.loginForm.controls
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      console.log("something went wrong !!");
      return;
    }
    let data = this.loginForm.value;

    this.api.post("login", data).subscribe({
      next: (res: any) => {
        console.log(res,
          "::::::::::::: You'r Logged In Suucessfully :::::::::::::::"
        );
        localStorage.setItem("AskPertsAdmin", JSON.stringify(res["response"]));
        this.api.user.next(res["response"]);
        this.router.navigateByUrl("/home/dashboard");
        this.toastr.success("You'r Logged In Suucessfully")
      },
      error: (err) => {
        this.toastr.error(err.error.message);
        console.log(err.error);
      },
    });
  }
}
