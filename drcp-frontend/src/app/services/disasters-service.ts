import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisastersService {
  
  API_URL:string="";

  constructor(private http : HttpClient){
    this.API_URL="http://localhost:8080/disasters";
  }

  getAllDisasters() : Observable<any>{
    return this.http.get(this.API_URL);
  }

  getDisasterById(id : any) : Observable<any>{
    return this.http.get(`${this.API_URL}/${id}`);
  }

  createDisaster(disaster: any) : Observable<any>{
    return this.http.post<any>(this.API_URL, disaster);
  }

  updateDisasterById(id:any, disaster: any) : Observable<any>{
    return this.http.patch(`${this.API_URL}/${id}`, disaster);
  }

  deleteDisasterById(id : any) : Observable<any>{
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  getCoordinates(disasterId : any) : Observable<any>{
    return this.http.get(`${this.API_URL}/getCoordinates/${disasterId}`);
  }
}
