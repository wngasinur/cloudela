import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { icon, latLng, Map, marker, point, polyline, tileLayer, Marker, circle, popup, LeafletMouseEvent, LatLngLiteral, LatLngTuple, LatLngBoundsLiteral, LatLngBounds } from 'leaflet';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Area } from '../core/model/area';
import { Summary } from '../core/model/summary';
import { MasterReferenceService } from '../core/master-reference.service';
import { PsfAnalyticsService } from '../core/psf-analytics.service';
import { HomeStoreService } from './home-store.service';
import { Region } from '../core/model/region';
import { CondoMasterSales } from '../core/model/condo-master-sales';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'appxx';
  summary$: Observable<Summary>;
  areaSummary$: Observable<Summary>;
  condoSummary$: Observable<CondoMasterSales>;
  condoListSummary$: Observable<CondoMasterSales[]>;

  search: any;
  dropdowns$: Observable<Area[]>;
  selectedRegion: Region;
  selectedCondo: any;

  layers = [];
  map: Map;
  fitBounds: any = null;

  constructor(
    private homeStoreService: HomeStoreService,
    private masterReferenceService: MasterReferenceService,
    private psfAnalyticsService: PsfAnalyticsService,
    private changeDetector: ChangeDetectorRef,
    private zone: NgZone ) {
  }
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&amp;copy; &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt; contributors'
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&amp;copy; &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt; contributors'
  });


  // layersControl = {
  //   baseLayers: {
  //     'Street Maps': this.streetMaps,
  //     'Wikimedia Maps': this.wMaps
  //   },
  //   overlays: {
  //     'Mt. Rainier Summit': this.summit,
  //     'Mt. Rainier Paradise Start': this.paradise
  //   }
  // };

  options = {
    layers: [this.streetMaps],
    zoom: 7,
    center: latLng([1.3521, 103.8198]),
    preferCanvas: true
  };



  onMapReady(mapx: Map) {

    this.map = mapx;
    this.map.setView([1.3521, 103.8198], 11);
    // map.fitBounds(this.route.getBounds(), {
    //   padding: point(24, 24),
    //   maxZoom: 12,
    //   animate: true
    // });
  }


  onDropdownChange($event): void {

    this.layers = [];

    this.selectedCondo = undefined;

    this.selectedRegion = undefined;

    if ($event && $event.id) {
      this.selectedRegion = $event.id;
      this.areaSummary$ = this.psfAnalyticsService.getAreaSummary($event.id);
      this.condoListSummary$ = this.psfAnalyticsService.getCondoListSummary($event.id);
      this.homeStoreService.loadRegion($event.id, $event.type);
    }

    

  }

  ngOnInit(): void {

    this.dropdowns$ = this.masterReferenceService.getDropdown();

    this.summary$ = this.psfAnalyticsService.getSummary();

    this.homeStoreService.selectedRegion.pipe(filter(region => region !== undefined)).subscribe(regionCondoMaster => {
      const pol = [];
      regionCondoMaster.region.geometry.coordinates.forEach(coordinate => {
        pol.push(coordinate.map(x => [x[1], x[0]]));
      });
      this.layers.push(polyline(pol));

      //pol.map(x => x[0])

      const markers: LatLngBoundsLiteral = [];
      regionCondoMaster.condoMasters.forEach(element => {

        markers.push([element.geometry.coordinates[1], element.geometry.coordinates[0]]);
        this.layers.push(marker([element.geometry.coordinates[1], element.geometry.coordinates[0]], {
          icon: icon({
            iconSize: [15, 21],
            iconAnchor: [13, 25],
            iconUrl: 'leaflet/marker-icon.png'
          })

        }).bindPopup(`${element.name}`).on('click', this.openCondoInfo, this));

      });

      const bounds = new LatLngBounds(markers);
      this.map.fitBounds(bounds);

    });


    this.homeStoreService.selectedCondo.pipe(filter(condo => condo !== undefined)).subscribe(condoMasterSales => {
      console.log(condoMasterSales.condoMaster);
    });
  }

  openCondoInfo($event: LeafletMouseEvent) {
    this.zone.run(() => {
      this.selectedCondo = $event.latlng;
      this.condoSummary$ = this.psfAnalyticsService.getCondoSummary($event.latlng);
    });
  }
}
