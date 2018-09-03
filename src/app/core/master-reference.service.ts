import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Area } from './model/area';
import { Region } from './model/region';
import { RegionCondoMaster } from './model/region-condo-master';
import { LatLng } from 'leaflet';
import { CondoMasterSales } from './model/condo-master-sales';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterReferenceService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
   }

  getDropdown(): Observable<Area[]> {
    return this.http.get<Area[]>(`/api/dropdowns`);
  }

  getRegion(id: string, type: string): Observable<RegionCondoMaster> {
    return this.http.get<RegionCondoMaster>(`/api/region?id=${id}&type=${type}`);
  }

  getCondo(latlng: LatLng): Observable<CondoMasterSales> {
    return this.http.get<CondoMasterSales>(`/api/condo-info?lat=${latlng.lat}&lng=${latlng.lng}`);
  }
}
