import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  user:any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,private location: Location,
    private api:ApiService
    ) {}

    ngOnInit(): void {

      if(localStorage.getItem("AskPertsAdmin")){
        this.api.user.next(JSON.parse(localStorage.getItem("AskPertsAdmin")|| ''));
      }

      this.api.user.subscribe((res:any)=>{
        if(res){
          this.user = res;
          console.log("USER :",res);
        }
      });
    }

  getClass(){
    var viewLocation = location.pathname; 
    return viewLocation.includes('/home/sub-admin') || viewLocation.includes('/home/add-admin') ? 'active' : '';
    //[routerLinkActiveOptions]="{match:['/home/sub-admin', '/home/add-admin']}"
  }

  getCategoryActive (){
    var viewLocation = location.pathname; 
    return viewLocation.includes('/home/category-mgmt') || viewLocation.includes('/home/sub-category-mgmt') ? 'active' : '';
  }

}
