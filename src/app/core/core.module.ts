import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MasterReferenceService } from './master-reference.service';
import { PsfAnalyticsService } from './psf-analytics.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { HttpClientInterceptor } from './http-client.interceptor';
@NgModule({
  imports: [RouterModule, HttpClientModule],
  declarations: [NavbarComponent, ToolbarComponent],
  exports: [RouterModule,
    NavbarComponent, ToolbarComponent],
    providers: [MasterReferenceService, PsfAnalyticsService, UserService, AuthService, 
    { provide: HTTP_INTERCEPTORS, useClass: HttpClientInterceptor, multi: true}]
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
