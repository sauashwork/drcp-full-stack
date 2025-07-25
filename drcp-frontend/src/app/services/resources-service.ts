import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  
  API_URL:string="";

  constructor(private http : HttpClient){
    this.API_URL="http://localhost:8080/resources";
  }

  getAllResources() : Observable<any>{
    return this.http.get(this.API_URL);
  }

  createResource(resource: any) : Observable<any>{
    return this.http.post<any>(this.API_URL, resource);
  }

  getResourceById(id : any) : Observable<any>{
    return this.http.get(`${this.API_URL}/${id}`);
  }

  updateResourceById(id:any, resource: any) : Observable<any>{
    return this.http.patch(`${this.API_URL}/${id}`, resource);
  }

  deleteResourceById(id : any) : Observable<any>{
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  findAllResourcesByDisasterId(disasterId : any) : Observable<any>{
    return this.http.get(`${this.API_URL}/byDisasterId/${disasterId}`);
  }

  getCoordinates(resourceId : any) : Observable<any>{
    return this.http.get(`${this.API_URL}/getCoordinates/${resourceId}`);
  }
}
