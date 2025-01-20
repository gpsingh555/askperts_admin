import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  subAdminForm!:FormGroup;
  isSubmitted!:boolean;
  profileData:any;
  isAtLeastOneCheckboxSelected:any
  constructor(
    private activeRoute : ActivatedRoute,
    private fb : FormBuilder,
    private apiService : ApiService,
    private route: Router,
    private toast : ToastrService
    ) { }

  ngOnInit(): void {
    this.validationForm();
    this.activeRoute.queryParamMap
    .subscribe((params:any) => {
      if( Object.keys(params['params']).length > 0){ 
        let values = JSON.parse(params['params'].pass);
        this.profileData = values;
        this.subAdminForm.patchValue({
          _id: values._id,
          email: values.email,
          password: values.password,
          name: values.name,
          mobileNumber: values.mobileNumber,
          consultant_mngnt: values.consultant_mngnt,
          user_mngnt: values.user_mngnt,
          subcription_mngnt: values.subcription_mngnt,
          category_mngnt: values.category_mngnt,
          banner_mngnt: values.banner_mngnt,
          payment_mngnt: values.payment_mngnt,
          call:values.call,
          cms:values.cms,
          report_mgnt:values.report_mgnt,
          notification_mgnt:values.notification_mgnt,
          dashboard:values.dashboard
        })
        console.log("VALUES :",this.subAdminForm.value);
      }
              
    });

  }
moduleAccess:any[]=[]
  validationForm = ():void=>{
    this.subAdminForm = this.fb.group({
      _id: [''],
      email: ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$')]],
      name: ['',[Validators.required,
        Validators.maxLength(25),
        Validators.pattern('^[a-zA-Z ]*$')
      ]],
      mobileNumber: ['',[Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)
      ]],
      
      
      consultant_mngnt: [false,] ,
      user_mngnt: [false],
      subcription_mngnt: [false],
      category_mngnt: [false],
      banner_mngnt: [false],
      payment_mngnt: [false],
      call:[false],
      cms:[false],
      report_mgnt:[false],
      notification_mgnt:[false],
      dashboard:[false]
      //      "is_deleted": false,
    });
  }

  createSubAdmin = ():void=>{
    this.isSubmitted = true;
    if (!this.isAtLeastOneModuleSelected()) {
      this.toast.warning("Please choose at least one module");
      return;
    }
    if(this.subAdminForm.valid){
      let passValue = this.subAdminForm.value
      console.log("this.subAdminForm.value.password :",this.subAdminForm.value.password);
      console.log("this.profileData :",this.profileData);
      if(this.subAdminForm.value.password != this.profileData?.password){
        passValue.passwordUpdated = true;
      }else{
        passValue.passwordUpdated = false;
      }
      this.createAndUpdateSubAdmin(passValue);
    }
  };

  get form1():{ [key: string]: AbstractControl; }{
    return this.subAdminForm.controls;
  }

  isAtLeastOneModuleSelected(): boolean {
    const moduleKeys = [
      'consultant_mngnt', 'user_mngnt', 'subcription_mngnt', 'category_mngnt',
      'banner_mngnt', 'payment_mngnt', 'call', 'cms', 'report_mgnt',
      'notification_mgnt', 'dashboard'
    ];
  
    return moduleKeys.some(key => this.subAdminForm.get(key)?.value === true);
  }
  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
         return false;
      }
      return true;
  
  }

  lettersOnly(event:any):boolean {
    //console.log("Event :",event.key);
    //var charCode = event.key;

    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
        return false;
    }
    return true;
  }

  createAndUpdateSubAdmin(data:any){
    if(!data._id){
      delete data._id;
    }
    console.log("Value :",data);
    this.apiService.post(`subAdmin`,data).subscribe(
      {
        next :(res:any)=>{
          this.isSubmitted = false;
          this.toast.success(res.message);
          this.route.navigateByUrl('/home/sub-admin');
        },
        error :(err:any)=>{
          console.log("ERROR :",err);
        }
      }
    );
  }

}
