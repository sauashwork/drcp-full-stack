import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  
  // API_URL:string="https://drcp-backend-d40a.onrender.com/reports";
  API_URL=environment.API_URL+"/reports";

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
