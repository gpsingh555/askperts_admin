import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private router: Router) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // debugger
    let adminData = localStorage.getItem("AskPertsAdmin");
    var token;
    if (adminData && adminData != "undefined") {
      token = JSON.parse(adminData).token;
    } else {
      token = "";
    }
    let url = "";

    url = req.url;

    const copiedReq = req.clone({
      headers: req.headers.append("access_token", token),
      url: url,
    });

    return next.handle(copiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error && (error.error.message == "Invalid access_token." || error.error.message == "No token provided")) {
          localStorage.removeItem("AskPertsAdmin");
          this.router.navigate(["/login"]);
        }
        return throwError(error);
      })
    );
  }
}
