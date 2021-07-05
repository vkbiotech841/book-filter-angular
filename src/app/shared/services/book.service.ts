import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { BaseApiUrl } from '../../base_api/base-api-urls';

export interface BookFilter {
  topic?: string;
  search?: string;
  page?: number;
  mime_type?: string;
  ids?: string;
  languages?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {


  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  constructor(
    private http: HttpClient,
  ) { }

  // baseUrl: string = "https://gutendex.com/books";
  private baseUrl: string = BaseApiUrl.Books;


  public getBooks(): Observable<any> {
    return this.http
      .get(this.baseUrl)
      .pipe(map(this.extractData));
  };

  public getFilterdBooks(filter: BookFilter): Observable<any> {
    const url = new URL(this.baseUrl);
    for (const key of Object.keys(filter)) {
      url.searchParams.set(key, filter[key]);
      console.log("key", key, "filter[key]", filter[key]);
      console.log("url.href", url.href);
    }
    return this.http
      .get(url.href)
      .pipe(map(this.extractData));
  };



}
