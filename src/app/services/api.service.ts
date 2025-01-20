import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  baseUrl = environment.baseUrl
  user = new BehaviorSubject<any>(null);

  get(url: any) {
    return this.http.get(`${this.baseUrl}/admin/${url}`);
  }

  post(url: any, data: any) {
    return this.http.post(`${this.baseUrl}/admin/${url}`, data);
  }

  patch(url: any, data: any) {
    return this.http.patch(`${this.baseUrl}/admin/${url}`, data);
  }
}
