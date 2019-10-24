import { Component, OnInit } from '@angular/core';

import { HeroService } from '../hero.service';
import { Hero } from '../hero';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private result: Subject<number> = new Subject<number>();

  constructor(private heroService: HeroService) { 
    this.result.asObservable().pipe(
      debounceTime(5000),
      map((d) => d * 100)
    ).subscribe(d => console.log("the result is "+ d));
  }

  ngOnInit() {
    this.getHeroes();
  }

  heroes: Hero[];

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes.slice(1,5));
  }

  onResult(event: number) {
    console.log(event);
    this.result.next(event);
  }
}
