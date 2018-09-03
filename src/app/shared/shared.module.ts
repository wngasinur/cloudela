import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NameListService } from './name-list/name-list.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastComponent } from './toast/toast.component';
import { LoginComponent } from '../login/login.component';
import { LogoutComponent } from '../logout/logout.component';
import { RegisterComponent } from '../register/register.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { AboutComponent } from '../about/about.component';
import { LoadingComponent } from './loading/loading.component';
import { TokenComponent } from '../token/token.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */
@NgModule({
  imports: [CommonModule,
    LeafletModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    NgSelectModule
],
declarations: [LoginComponent, LogoutComponent, RegisterComponent,
  NotFoundComponent, ToastComponent, AboutComponent, LoadingComponent, TokenComponent],
  exports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LeafletModule,
    NgbModule,
    NgSelectModule,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    NotFoundComponent,
    ToastComponent,
    AboutComponent,
    LoadingComponent,
    TokenComponent],
    providers: [ToastComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NameListService]
    };
  }
}
