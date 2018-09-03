import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-region-info',
  templateUrl: './region-info.component.html',
  styleUrls: ['./region-info.component.css']
})
export class RegionInfoComponent implements OnInit {

  @Input() id: string;

  constructor() { }

  ngOnInit() {
  }

}
