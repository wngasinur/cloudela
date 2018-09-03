import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Summary } from './model/summary';
import { Observable } from 'rxjs';
import { CondoMasterSales } from './model/condo-master-sales';
import { LatLng } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class PsfAnalyticsService {

  constructor(private http: HttpClient) { }

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>('/api/summary');
  }

  getAreaSummary(id: string): Observable<Summary> {
    return this.http.get<Summary>('/api/summary_area?id=' + id);
  }

  getCondoSummary(latlng: LatLng): Observable<CondoMasterSales> {
    return this.http.get<CondoMasterSales>(`/api/condo-info?lat=${latlng.lat}&lng=${latlng.lng}`);
  }

  getCondoListSummary(id: string): Observable<CondoMasterSales[]> {
    return this.http.get<CondoMasterSales[]>(`/api/condo-list?id=${id}`);
  }
}
