import { Injectable } from '@angular/core';
import { MasterReferenceService } from '../core/master-reference.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Region } from '../core/model/region';
import { RegionCondoMaster } from '../core/model/region-condo-master';
import { LatLng } from 'leaflet';
import { SalesHistoryAgg } from '../core/model/sales-histories-agg';
import { CondoMasterSales } from '../core/model/condo-master-sales';

@Injectable({
  providedIn: 'root'
})
export class HomeStoreService {

  private _selectedRegion: BehaviorSubject<RegionCondoMaster|undefined> = new BehaviorSubject(undefined);

  private _selectedCondo: BehaviorSubject<CondoMasterSales|undefined> = new BehaviorSubject(undefined);

  public readonly selectedRegion: Observable<RegionCondoMaster> = this._selectedRegion.asObservable();

  public readonly selectedCondo: Observable<CondoMasterSales> = this._selectedCondo.asObservable();

  constructor(private masterReferenceService: MasterReferenceService) { }

  public loadRegion(id: string, type: string) {
      this.masterReferenceService.getRegion(id, type).subscribe(resp => {
          this._selectedRegion.next(resp);
      });
  }

  public loadCondo(latlng: LatLng) {
    this.masterReferenceService.getCondo(latlng).subscribe(resp => {
      this._selectedCondo.next(resp);
  });
  }

}
