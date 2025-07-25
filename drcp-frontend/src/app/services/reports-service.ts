import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  
  API_URL:string="http://localhost:8080/reports";

  constructor(private http: HttpClient){
  }

  createNewReport(report : any) : Observable<any>{
    console.log("report: ",report);
    return this.http.post(`${this.API_URL}`, report);
  }

  getAllReports() : Observable<any>{
    return this.http.get(`${this.API_URL}`);
  }

  
  
}
