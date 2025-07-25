import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  
  API_URL : string="";

  constructor(private http: HttpClient){
    this.API_URL="http://localhost:8080/reports";
  }

  createNewReport(report : any) : Observable<any>{
    console.log("report: ",report);
    return this.http.post(`${this.API_URL}`, report);
  }

  getAllReports() : Observable<any>{
    return this.http.get(`${this.API_URL}`);
  }

  
  
}
