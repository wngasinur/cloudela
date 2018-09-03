import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { RegionInfoComponent } from './region-info/region-info.component';
import { HomeStoreService } from './home-store.service';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ],
  exports: [HomeComponent],
  declarations: [HomeComponent, RegionInfoComponent],
  providers: [HomeStoreService]
})
export class HomeModule { }
