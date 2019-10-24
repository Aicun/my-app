import { Component, OnInit, Output } from '@angular/core';
import { HeroService } from '../hero.service';
import { Observable, Subject } from 'rxjs';
import { Hero } from '../hero';
import { switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {

  @Output()
  result: Observable<number>;

  protected _textChangedSubject: Subject<number> = new Subject<number>();

  heroes: Observable<Hero[]>;
  private searchTerm = new Subject<string>();

  constructor(private heroService: HeroService) {
    this.result = this._textChangedSubject.asObservable();
   }

  search(term: string) {
    this.searchTerm.next(term);
    this._textChangedSubject.next(1);
  }

  ngOnInit() {
    this.heroes = this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );    
  }

}
