import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  constructor(public auth: AuthService,
    private changeDetector: ChangeDetectorRef) { }

ngAfterViewChecked() {
this.changeDetector.detectChanges();
}
}
