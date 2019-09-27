import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private messageService: MessageService,
    private httpClient: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
        return this.httpClient.get<Hero[]>(this.heroesUrl)
        .pipe(
          tap(_ => this.log('HeroService: fetched heroes')),
          catchError(this.handleError<Hero[]>('getHeroes', [])));
  }

  handleError<T>(operation : string, result?: T): any {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.get<Hero>(url)
    .pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any>{
    return this.httpClient.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`update hero with id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
        );
  }

  addHero(newHero: Hero): Observable<Hero> {
    return this.httpClient.post<Hero>(this.heroesUrl, newHero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`added hero w/ id=${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }
  
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
  
    return this.httpClient.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()) {
      return of([]);
    }

    return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`search heroes matching ${term}`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
