import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  constructor( private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

    const token = this.route.snapshot.paramMap.get('token');
    console.log(token);
    this.router.navigate(['/']);
  }

}
